from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class InteractionResult(Base):
    __tablename__ = "interaction_results"

    id = Column(Integer, primary_key=True)

        # Эм А
    drug_a_id = Column(String, nullable=False)
    drug_a_inn = Column(String, nullable=False)
    drug_a_mn = Column(String, nullable=False)

        # Эм Б
    drug_b_id = Column(String, nullable=False)
    drug_b_inn = Column(String, nullable=False)
    drug_b_mn = Column(String, nullable=False)

     # үр дүн
    severity = Column(String, nullable=False)
    description_en = Column(String, nullable=False)
    description_mn = Column(String, nullable=False)

    count = Column(Integer, default=1, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    __table_args__ = (
        UniqueConstraint("drug_a_id", "drug_b_id", name="uq_interaction_result"),
    )

class UserHistory(Base):
    __tablename__ = "user_history"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    interaction_id = Column(Integer, ForeignKey("interaction_results.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("user_id", "interaction_id", name="uq_user_history"),
    )

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    
class PasswordResetCode(Base):
    __tablename__ = "password_reset_codes"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    
    
    
    # ===========================Admin models=============================== #

class AdminUser(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))