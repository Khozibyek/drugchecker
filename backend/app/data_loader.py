import os
import csv
from pathlib import Path
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# Raw data
DRUGS = []
INTERACTIONS = []
SEVERITY_RULES = []
TEMPLATES = []

# Name mappings
MN_TO_INN = {}
INN_TO_MN = {}
NAME_TO_DBID = {}
DBID_TO_NAME = {}
PAIR_INDEX = {}
PAIR_META = {}
DDINTER_SEVERITY = {}

def _norm(s: str) -> str:
    return str(s).strip().lower()

def _read_csv(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        return list(reader)

def _load_interactions_from_db():
    global INTERACTIONS, NAME_TO_DBID, DBID_TO_NAME, PAIR_INDEX, PAIR_META
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT drugbank_id, drug_name, interacts_with_id, description FROM drug_interactions"))
        rows = result.fetchall()
    
    INTERACTIONS = [{"drugbank_id": r[0], "drug_name": r[1], "interacts_with_id": r[2], "description": r[3]} for r in rows]
    
    for row in INTERACTIONS:
        a_id = _norm(row.get("drugbank_id", ""))
        a_name_raw = row.get("drug_name", "")
        a_name = _norm(a_name_raw)
        b_id = _norm(row.get("interacts_with_id", ""))
        desc = row.get("description", "")

        if a_name and a_id:
            if a_name not in NAME_TO_DBID:
                NAME_TO_DBID[a_name] = a_id
        if a_id and a_name_raw:
            if a_id not in DBID_TO_NAME:
                DBID_TO_NAME[a_id] = a_name_raw.strip()
        if a_id and b_id:
            key = tuple(sorted([a_id, b_id]))
            if key not in PAIR_INDEX:
                PAIR_INDEX[key] = [desc]
            else:
                PAIR_INDEX[key].append(desc)
            if key not in PAIR_META:
                PAIR_META[key] = {
                    "drug_a_id": a_id,
                    "drug_b_id": b_id,
                    "description": desc,
                    "severity": "unknown",
                }
    print(f"[INFO] Database-с {len(INTERACTIONS)} interaction ачаалагдлаа")

def load_csv() -> None:
    global DRUGS, SEVERITY_RULES, TEMPLATES
    global MN_TO_INN, INN_TO_MN
    global DDINTER_SEVERITY

    # CSV файлуудыг унших
    DRUGS = _read_csv(DATA_DIR / "drug_name_map.csv")
    SEVERITY_RULES = _read_csv(DATA_DIR / "severity_rules.csv")
    TEMPLATES = _read_csv(DATA_DIR / "templates.csv")

    for row in DRUGS:
        drug_mn_raw = row.get("mn_name", "")
        drug_inn_raw = row.get("inn_name", "")
        drug_mn = _norm(drug_mn_raw)
        drug_inn = _norm(drug_inn_raw)
        if drug_mn and drug_inn:
            MN_TO_INN[drug_mn] = drug_inn
            INN_TO_MN[drug_inn] = drug_mn_raw.strip()

    # Interactions-г database-с унших
    if DATABASE_URL:
        _load_interactions_from_db()
    else:
        print("[WARN] DATABASE_URL байхгүй — interactions ачаалагдсангүй")

    DDINTER_SEVERITY = {}
    if DATABASE_URL:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT drug_a, drug_b, level FROM severity_level"))
            for row in result:
                a = _norm(row[0])
                b = _norm(row[1])
                level = (row[2] or "").strip()
                if a and b and level:
                    pair = tuple(sorted([a, b]))
                    DDINTER_SEVERITY[pair] = level
        print(f"[INFO] DDinter database-с ачаалагдлаа: {len(DDINTER_SEVERITY)} хосолбор")
    else:
        print("[WARN] DATABASE_URL байхгүй — DDinter ачаалагдсангүй")

def get_mongolian_name_by_english_name(name: str) -> str:
    name_norm = _norm(name)
    return INN_TO_MN.get(name_norm, name)

def get_english_name_by_dbid(dbid: str) -> str:
    dbid_norm = _norm(dbid)
    return DBID_TO_NAME.get(dbid_norm, dbid)

def get_display_name_by_dbid(dbid: str) -> str:
    english_name = get_english_name_by_dbid(dbid)
    mongolian_name = get_mongolian_name_by_english_name(english_name)
    return mongolian_name
