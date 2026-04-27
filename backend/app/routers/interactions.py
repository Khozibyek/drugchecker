from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.services.interaction_service import check_interaction
from app.database import get_db
from app.security import get_current_user
from app.models import InteractionResult, UserHistory

router = APIRouter()

class InteractionCheckRequest(BaseModel):
    drug_a: str
    drug_b: str

@router.post("/interactions/check")
def check(
    payload: InteractionCheckRequest,
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user)
):
    result = check_interaction(payload.drug_a, payload.drug_b)

    if result.get("has_interaction"):
        drug_a_id, drug_b_id = sorted([
            result.get("drug_a_id", ""),
            result.get("drug_b_id", "")
        ])

        interaction = db.query(InteractionResult).filter(
            InteractionResult.drug_a_id == drug_a_id,
            InteractionResult.drug_b_id == drug_b_id
        ).first()

        if not interaction:
            interaction = InteractionResult(
                drug_a_id=drug_a_id,
                drug_a_inn=result.get("drug_a_inn", ""),
                drug_a_mn=result.get("drug_a_mn", ""),
                drug_b_id=drug_b_id,
                drug_b_inn=result.get("drug_b_inn", ""),
                drug_b_mn=result.get("drug_b_mn", ""),
                severity=result.get("severity", "UNKNOWN"),
                description_en=result.get("description_en", ""),
                description_mn=result.get("description_mn", ""),
                count=1
            )
            db.add(interaction)
        else:
            interaction.count += 1

        db.flush()

        if user_id:
            existing = db.query(UserHistory).filter(
                UserHistory.user_id == user_id,
                UserHistory.interaction_id == interaction.id
            ).first()

            if not existing:
                db.add(UserHistory(
                    user_id=user_id,
                    interaction_id=interaction.id
                ))

        db.commit()

    return result 

@router.get("/interactions/popular")
def get_popular(db: Session = Depends(get_db)):
    top = db.query(InteractionResult).order_by(
        InteractionResult.count.desc()
    ).limit(16).all()

    seen_ids = set()
    seen_names = set()
    drugs = []

    for i in top:
        if not i.drug_a_id or not i.drug_b_id:
            continue

        # Эм А
        a_name = i.drug_a_mn or i.drug_a_inn
        if i.drug_a_id not in seen_ids and a_name not in seen_names and a_name:
            seen_ids.add(i.drug_a_id)
            seen_names.add(i.drug_a_mn)
            seen_names.add(i.drug_a_inn)
            drugs.append({
                "drug_id": i.drug_a_id,
                "drug_mn": a_name,
                "drug_inn": i.drug_a_inn,
            })

        # Эм Б
        b_name = i.drug_b_mn or i.drug_b_inn
        if i.drug_b_id not in seen_ids and b_name not in seen_names and b_name:
            seen_ids.add(i.drug_b_id)
            seen_names.add(i.drug_b_mn)
            seen_names.add(i.drug_b_inn)
            drugs.append({
                "drug_id": i.drug_b_id,
                "drug_mn": b_name,
                "drug_inn": i.drug_b_inn,
            })

        if len(drugs) >= 10:
            break

    return drugs