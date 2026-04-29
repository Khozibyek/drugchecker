import csv
import os
from typing import Optional
from jose import jwt, JWTError
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AdminUser, User, InteractionResult, UserHistory, Feedback
from app.schemas import AdminLogin, AdminPasswordUpdate, UserRegister, AdminUserUpdate
from app.security import hash_password, verify_password, create_token, oauth2_scheme, SECRET_KEY, ALGORITHM


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "data")
router = APIRouter(prefix="/admin", tags=["Admin"])

# админ нэвтрэх
@router.post("/login")
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.email == data.email).first()
    if not admin or not verify_password(data.password, admin.password):
        raise HTTPException(status_code=401, detail="Нэвтрэх мэдээлэл буруу байна")
    
    
    token = create_token({
        "admin_id": admin.id,
        "username": admin.username,
        "email": admin.email,
    })

    return {"access_token": token, "token_type": "bearer"}

# админ самбарын мэдээлэл
@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_interactions = db.query(InteractionResult).count()
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
    recent_interactions = db.query(InteractionResult).order_by(InteractionResult.created_at.desc()).limit(5).all()
    
    return {
        "total_users": total_users,
        "total_interactions": total_interactions,
        "recent_users": [
            {
                "id": u.id,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email,
                "created_at": u.created_at
            }
            for u in recent_users
        ],
        "recent_interactions": [
            {
                "id": i.id,
                "drug_a_mn": i.drug_a_mn,
                "drug_b_mn": i.drug_b_mn,
                "severity": i.severity,
                "created_at": i.created_at
            }
            for i in recent_interactions
        ]
    }

def get_current_admin(token: Optional[str] = Depends(oauth2_scheme)) -> int:
    if not token:
        raise HTTPException(status_code=401, detail="Нэвтрэх шаардлагатай")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = payload.get("admin_id")
        if not admin_id:
            raise HTTPException(status_code=401, detail="Token буруу байна")
        return admin_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Token буруу байна")

# админ өөрийн мэдээлэл харах
@router.get("/me")
def get_admin_me(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    admin = db.query(AdminUser).filter(AdminUser.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Админ олдсонгүй")
    return {
        "id": admin.id,
        "username": admin.username,
        "email": admin.email,
        "created_at": str(admin.created_at),
    }
# админ хэрэглэгч харах
@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email,
            "created_at": str(u.created_at),
            "history_count": db.query(UserHistory).filter(UserHistory.user_id == u.id).count()
        }
        for u in users
    ]
# админ хэрэглэгч устгах
@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")
    db.delete(user)
    db.commit()
    return {"message": "Амжилттай устгалаа"}

# админ нууц үг солих   
@router.put("/me/password")
def update_admin_password(
    data: AdminPasswordUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    admin = db.query(AdminUser).filter(AdminUser.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Админ олдсонгүй")
    if not verify_password(data.current_password, admin.password):
        raise HTTPException(status_code=400, detail="Одоогийн нууц үг буруу байна")
    admin.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Нууц үг амжилттай солигдлоо"}

# админ хэрэглэгч үүсгэх
@router.post("/users")
def create_user(
    data: UserRegister,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Имэйл бүртгэлтэй байна")
    
    new_user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=hash_password(data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "id": new_user.id,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "email": new_user.email,
        "created_at": str(new_user.created_at),
    }

# админ хэрэглэгчийн мэдээлэл засах
@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")
    
    user.first_name = data.first_name
    user.last_name = data.last_name
    user.email = data.email
    
    if data.new_password:
        user.password = hash_password(data.new_password)
    
    db.commit()
    
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "created_at": str(user.created_at),
    }
def update_user(
    user_id: int,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")
    
    user.first_name = data.first_name
    user.last_name = data.last_name
    db.commit()
    
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "created_at": str(user.created_at),
    }

# Хэрэглэгчийн түүх харах
@router.get("/users/{user_id}/history")
def get_user_history(
    user_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    results = db.query(UserHistory, InteractionResult).join(
        InteractionResult, UserHistory.interaction_id == InteractionResult.id
    ).filter(
        UserHistory.user_id == user_id
    ).order_by(UserHistory.created_at.desc()).all()
    
    return [
        {
            "id": h.id,
            "drug_a_mn": i.drug_a_mn,
            "drug_b_mn": i.drug_b_mn,
            "drug_a_inn": i.drug_a_inn,
            "drug_b_inn": i.drug_b_inn,
            "severity": i.severity,
            "created_at": str(h.created_at),
        }
        for h, i in results
    ]

# Бүх харилцан үйлчлэл харах
@router.get("/interactions")
def get_interactions(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    interactions = db.query(InteractionResult).order_by(
        InteractionResult.created_at.desc()
    ).all()
    
    return [
        {
            "id": i.id,
            "drug_a_mn": i.drug_a_mn,
            "drug_b_mn": i.drug_b_mn,
            "drug_a_inn": i.drug_a_inn,
            "drug_b_inn": i.drug_b_inn,
            "description_en": i.description_en,
            "description_mn": i.description_mn,
            "severity": i.severity,
            "count": i.count,
            "created_at": str(i.created_at),
        }
        for i in interactions
    ]

# санал хүсэлт харах
@router.get("/feedbacks")
def get_feedbacks(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    feedbacks = db.query(Feedback, User).join(
        User, Feedback.user_id == User.id
    ).order_by(Feedback.created_at.desc()).all()
    
    return [
        {
            "id": f.id,
            "title": f.title,
            "content": f.content,
            "created_at": str(f.created_at),
            "user_name": f"{u.first_name} {u.last_name}",
            "user_email": u.email,
        }
        for f, u in feedbacks
    ]

#=========================Өгөгдөлд ажиллах============================#
# Эмийн нэршил
@router.get("/data/drugs")
def get_drug_names(admin_id: int = Depends(get_current_admin)):
    path = os.path.join(DATA_DIR, "drug_name_map.csv")
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

@router.put("/data/drugs/{drug_id}")
def update_drug_name(
    drug_id: str,
    data: dict,
    admin_id: int = Depends(get_current_admin)
):
    path = os.path.join(DATA_DIR, "drug_name_map.csv")
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["drug_id"] == drug_id:
                row["mn_name"] = data.get("mn_name", row["mn_name"])
                row["inn_name"] = data.get("inn_name", row["inn_name"])
            rows.append(row)
    
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["drug_id", "mn_name", "inn_name"])
        writer.writeheader()
        writer.writerows(rows)
    
    return {"message": "Амжилттай хадгаллаа"}

@router.delete("/data/drugs/{drug_id}")
def delete_drug_name(
    drug_id: str,
    admin_id: int = Depends(get_current_admin)
):
    path = os.path.join(DATA_DIR, "drug_name_map.csv")
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["drug_id"] != drug_id:
                rows.append(row)
    
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["drug_id", "mn_name", "inn_name"])
        writer.writeheader()
        writer.writerows(rows)
    
    return {"message": "Амжилттай устгалаа"}


# Монгол тайлбар
@router.get("/data/templates")
def get_templates(admin_id: int = Depends(get_current_admin)):
    path = os.path.join(DATA_DIR, "templates.csv")
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

@router.put("/data/templates/{template_id}")
def update_template(
    template_id: str,
    data: dict,
    admin_id: int = Depends(get_current_admin)
):
    path = os.path.join(DATA_DIR, "templates.csv")
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["id"] == template_id:
                row["keywords"] = data.get("keywords", row["keywords"])
                row["template"] = data.get("template", row["template"])
            rows.append(row)
    
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "keywords", "template"])
        writer.writeheader()
        writer.writerows(rows)
    
    return {"message": "Амжилттай хадгаллаа"}

@router.delete("/data/templates/{template_id}")
def delete_template(
    template_id: str,
    admin_id: int = Depends(get_current_admin)
):
    path = os.path.join(DATA_DIR, "templates.csv")
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["id"] != template_id:
                rows.append(row)
    
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "keywords", "template"])
        writer.writeheader()
        writer.writerows(rows)
    
    return {"message": "Амжилттай устгалаа"}

# үндсан өгөгдөл харах
@router.get("/data/interactions")
def get_data_interactions(
    q: str = "",
    limit: int = 100,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    from sqlalchemy import text
    query = "SELECT drugbank_id, drug_name, interacts_with_id, description FROM drug_interactions"
    params = {}
    if q:
        query += " WHERE LOWER(drug_name) LIKE :q"
        params["q"] = f"%{q.lower()}%"
    query += " LIMIT :limit"
    params["limit"] = limit
    result = db.execute(text(query), params)
    rows = [{"drugbank_id": r[0], "drug_name": r[1], "interacts_with_id": r[2], "description": r[3]} for r in result]
    return rows