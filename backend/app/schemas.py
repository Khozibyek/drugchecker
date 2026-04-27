from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class InteractionResultCreate(BaseModel):
    drug_a_id: str
    drug_a_inn: str
    drug_a_mn: str
    drug_b_id: str
    drug_b_inn: str
    drug_b_mn: str
    severity: str
    description_en: str | None = None
    description_mn: str | None = None

class InteractionResultOut(BaseModel):
    id: int
    drug_a_id: str
    drug_a_inn: str
    drug_a_mn: str
    drug_b_id: str
    drug_b_inn: str
    drug_b_mn: str
    severity: str
    description_en: str | None = None
    description_mn: str | None = None
    count: int = 0 
    created_at: datetime

    class Config:
        from_attributes = True

class UserHistoryOut(BaseModel):
    interaction: InteractionResultOut
    created_at: datetime

class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    current_password: str
    new_password: str | None = None
    confirm_password: str | None = None

    class Config:
        from_attributes = True


class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

class FeedbackCreate(BaseModel):
    title: str
    content: str


   # ===========================Admin schemas=============================== #

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class AdminUserUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    new_password: str | None = None