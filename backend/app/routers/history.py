from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import UserHistory, InteractionResult
from app.schemas import InteractionResultCreate
from app.security import get_current_user, get_required_user

router = APIRouter(prefix="/history", tags=["History"])


@router.post("")
def save_history(
    data: InteractionResultCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_required_user)
):
    if data.drug_a_id > data.drug_b_id:
        data.drug_a_id, data.drug_b_id = data.drug_b_id, data.drug_a_id
        data.drug_a_inn, data.drug_b_inn = data.drug_b_inn, data.drug_a_inn
        data.drug_a_mn, data.drug_b_mn = data.drug_b_mn, data.drug_a_mn

    interaction = db.query(InteractionResult).filter(
        InteractionResult.drug_a_id == data.drug_a_id,
        InteractionResult.drug_b_id == data.drug_b_id
    ).first()

    if not interaction:
        interaction = InteractionResult(
            drug_a_id=data.drug_a_id,
            drug_a_inn=data.drug_a_inn,
            drug_a_mn=data.drug_a_mn,
            drug_b_id=data.drug_b_id,
            drug_b_inn=data.drug_b_inn,
            drug_b_mn=data.drug_b_mn,
            severity=data.severity,
            description_en=data.description_en,
            description_mn=data.description_mn,
        )
        db.add(interaction)
        db.flush()

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
    return {"message": "Амжилттай хадгалагдлаа"}


@router.get("")
def get_history(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_required_user)
):
    rows = (
        db.query(UserHistory, InteractionResult)
        .join(InteractionResult, UserHistory.interaction_id == InteractionResult.id)
        .filter(UserHistory.user_id == user_id)
        .order_by(UserHistory.created_at.desc())
        .all()
    )

    return [
        {
            "id": interaction.id,
            "drug_a_mn": interaction.drug_a_mn,
            "drug_a_inn": interaction.drug_a_inn,
            "drug_b_mn": interaction.drug_b_mn,
            "drug_b_inn": interaction.drug_b_inn,
            "severity": interaction.severity,
            "description_mn": interaction.description_mn,
            "description_en": interaction.description_en,
            "created_at": history.created_at,
        }
        for history, interaction in rows
    ]


@router.delete("/{interaction_id}")
def delete_history(
    interaction_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_required_user)
):
    history = db.query(UserHistory).filter(
        UserHistory.user_id == user_id,
        UserHistory.interaction_id == interaction_id
    ).first()

    if not history:
        raise HTTPException(status_code=404, detail="Түүх олдсонгүй")

    db.delete(history)
    db.commit()
    return {"message": "Амжилттай устгагдлаа"}