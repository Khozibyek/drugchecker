from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Feedback
from app.schemas import FeedbackCreate
from app.security import get_required_user

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/")
def create_feedback(
    data: FeedbackCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_required_user)
):
    feedback = Feedback(
        user_id=user_id,
        title=data.title,
        content=data.content,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return {"message": "Санал хүсэлт амжилттай илгээгдлээ"}