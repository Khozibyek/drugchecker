import os
import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import UserUpdate

from app.database import get_db
from app.models import User, PasswordResetCode
from app.schemas import UserRegister, UserLogin, Token, UserUpdate, ForgotPasswordRequest, VerifyCodeRequest, ResetPasswordRequest
from app.security import hash_password, verify_password, create_token
from app.security import get_current_user, get_required_user
from app.services.mail_service import send_reset_code_email

router = APIRouter(prefix="/auth", tags=["Auth"])

RESET_CODE_EXPIRE_MINUTES = int(os.getenv("RESET_CODE_EXPIRE_MINUTES", "10"))

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Имэйл бүртгэлтэй байна")

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {"message": "Амжилттай бүртгэгдлээ"}


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Имэйл эсвэл нууц үг буруу байна")

    token = create_token({
        "user_id": db_user.id,
        "email": db_user.email,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
    
@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_required_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")

    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "created_at": user.created_at,
    }


@router.put("/me")
def update_me(
    data: UserUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_required_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")

    # 1. Одоогийн нууц үг шалгах
    if not verify_password(data.current_password, user.password):
        raise HTTPException(status_code=400, detail="Одоогийн нууц үг буруу байна")

    # 2. Нэр update
    if data.first_name is not None:
        user.first_name = data.first_name

    if data.last_name is not None:
        user.last_name = data.last_name

    # 3. Имэйл update
    if data.email is not None and data.email != user.email:
        existing = db.query(User).filter(
            User.email == data.email,
            User.id != user.id
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="Имэйл бүртгэлтэй байна")

        user.email = data.email

    # 4. Нууц үг update
    if data.new_password or data.confirm_password:
        if not data.new_password or not data.confirm_password:
            raise HTTPException(status_code=400, detail="Шинэ нууц үгийн талбаруудыг бүрэн бөглөнө үү")

        if data.new_password != data.confirm_password:
            raise HTTPException(status_code=400, detail="Шинэ нууц үг таарахгүй байна")

        if len(data.new_password) < 6:
            raise HTTPException(status_code=400, detail="Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байна")

        user.password = hash_password(data.new_password)

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "created_at": user.created_at,
    }





@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    # security: email байгаа эсэхийг ил гаргахгүй
    if not user:
        return {"message": "Хэрэв бүртгэлтэй бол сэргээх код илгээгдлээ"}

    # хуучин code-уудыг устгах
    db.query(PasswordResetCode).filter(
        PasswordResetCode.email == data.email
    ).delete()

    code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=RESET_CODE_EXPIRE_MINUTES)

    reset_row = PasswordResetCode(
        email=data.email,
        code=code,
        expires_at=expires_at,
    )
    db.add(reset_row)
    db.commit()

    send_reset_code_email(data.email, code)

    return {"message": "Хэрэв бүртгэлтэй бол сэргээх код илгээгдлээ"}


@router.post("/verify-code")
def verify_code(data: VerifyCodeRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Код эсвэл имэйл буруу байна")

    code_row = db.query(PasswordResetCode).filter(
        PasswordResetCode.email == data.email,
        PasswordResetCode.code == data.code
    ).first()

    if not code_row:
        raise HTTPException(status_code=400, detail="Код буруу байна")

    if code_row.expires_at < datetime.utcnow():
        db.delete(code_row)
        db.commit()
        raise HTTPException(status_code=400, detail="Кодын хугацаа дууссан байна")

    return {"message": "Код амжилттай баталгаажлаа"}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Код эсвэл имэйл буруу байна")

    code_row = db.query(PasswordResetCode).filter(
        PasswordResetCode.email == data.email,
        PasswordResetCode.code == data.code
    ).first()

    if not code_row:
        raise HTTPException(status_code=400, detail="Код буруу байна")

    if code_row.expires_at < datetime.utcnow():
        db.delete(code_row)
        db.commit()
        raise HTTPException(status_code=400, detail="Кодын хугацаа дууссан байна")

    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байна")

    user.password = hash_password(data.new_password)

    db.delete(code_row)
    db.commit()

    return {"message": "Нууц үг амжилттай шинэчлэгдлээ"}