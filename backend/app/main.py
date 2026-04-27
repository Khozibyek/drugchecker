from fastapi import FastAPI, Query
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app import data_loader as dl
from app.database import Base, engine
from app.routers import interactions, auth, history, admin, feedback

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    dl.load_csv()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router-ууд дараа
app.include_router(interactions.router)
app.include_router(auth.router)
app.include_router(history.router)
app.include_router(admin.router)
app.include_router(feedback.router)

@app.get("/")
def root():
    return {"status": "API running"}

@app.get("/drugs/search")
def search_drugs(q: str = Query(...), limit: int = 10):
    q = q.lower().strip()
    results = []
    for row in dl.DRUGS:
        mn = row.get("mn_name", "").lower()
        inn = row.get("inn_name", "").lower()
        if mn.startswith(q) or inn.startswith(q) or q in mn or q in inn:
            results.append({
                "drug_id":  row.get("drug_id"),
                "drug_mn":  row.get("mn_name"),
                "drug_inn": row.get("inn_name"),
                "score": 0 if (mn.startswith(q) or inn.startswith(q)) else 1
            })
        if len(results) >= limit:
            break
    return {"items": results}