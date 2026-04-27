import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# Raw data
DRUGS = []
INTERACTIONS = []
SEVERITY_RULES = []
TEMPLATES = []

# Name mappings
# Монгол нэр → INN (олон улсын нэр) холбоо
MN_TO_INN = {}
# INN (олон улсын нэр) → Монгол нэр холбоо
INN_TO_MN = {}
# Эмийн нэр → DrugBank ID холбоо
NAME_TO_DBID = {}
# DrugBank ID → Эмийн нэр холбоо
DBID_TO_NAME = {}   

# Pair mappings
# Эмийн хослолын түлхүүр → тайлбар текст
PAIR_INDEX = {}
# Эмийн хослолын түлхүүр → нэмэлт мэдээлэл (severity гэх мэт)
PAIR_META = {}    
# DDinter эмийн хосын эрсдлийн түвшин
# Key: tuple(sorted([drug_a_inn_lower, drug_b_inn_lower]))
# Value: "Major" / "Moderate" / "Minor"
DDINTER_SEVERITY = {}

def _norm(s: str) -> str:
    return str(s).strip().lower()


def _read_csv(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        return list(reader)


def load_csv() -> None:
    global DRUGS, INTERACTIONS, SEVERITY_RULES, TEMPLATES
    global MN_TO_INN, INN_TO_MN, NAME_TO_DBID, DBID_TO_NAME
    global PAIR_INDEX, PAIR_META
    global DDINTER_SEVERITY

    # 1. CSV файлуудыг унших
    DRUGS = _read_csv(DATA_DIR / "drug_name_map.csv")
    INTERACTIONS = _read_csv(DATA_DIR / "drug_interactions.csv")
    SEVERITY_RULES = _read_csv(DATA_DIR / "severity_rules.csv")
    TEMPLATES = _read_csv(DATA_DIR / "templates.csv")

    MN_TO_INN = {}
    INN_TO_MN = {}
    NAME_TO_DBID = {}
    DBID_TO_NAME = {}
    PAIR_INDEX = {}
    PAIR_META = {}

    for row in DRUGS:
        drug_mn_raw = row.get("mn_name", "")
        drug_inn_raw = row.get("inn_name", "")
        drug_mn = _norm(drug_mn_raw)
        drug_inn = _norm(drug_inn_raw)
        if drug_mn and drug_inn:
            if drug_mn in MN_TO_INN and MN_TO_INN[drug_mn] != drug_inn:
                print(f"[WARN] Давхардал: {drug_mn} → {MN_TO_INN[drug_mn]} vs {drug_inn}")
            MN_TO_INN[drug_mn] = drug_inn
            INN_TO_MN[drug_inn] = drug_mn_raw.strip()

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
                        "drug_a_id":   a_id,
                        "drug_b_id":   b_id,
                        "description": desc,
                        "severity":    row.get("severity", "unknown"),
                        }
                    
    DDINTER_SEVERITY = {}
    ddinter_path = DATA_DIR / "severity_level.csv"
    if ddinter_path.exists():
        with ddinter_path.open("r", encoding="utf-8-sig", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                a = _norm(row.get("Drug_A", ""))
                b = _norm(row.get("Drug_B", ""))
                level = (row.get("Level") or "").strip()
                if a and b and level:
                    pair = tuple(sorted([a, b]))
                    DDINTER_SEVERITY[pair] = level
        print(f"[INFO] DDinter ачаалагдлаа: {len(DDINTER_SEVERITY)} хосолбор")
    else:
        print(f"[WARN] DDinter файл олдсонгүй: {ddinter_path}")

def get_mongolian_name_by_english_name(name: str) -> str:

    name_norm = _norm(name)
    return INN_TO_MN.get(name_norm, name)


def get_english_name_by_dbid(dbid: str) -> str:
 
    dbid_norm = _norm(dbid)
    return DBID_TO_NAME.get(dbid_norm, dbid)


def get_display_name_by_dbid(dbid: str) -> str:
    """
    DrugBank ID-р монгол нэрийг буцаана.
    Монгол нэр байхгүй бол англи нэрийг буцаана.
    """
    english_name = get_english_name_by_dbid(dbid)
    mongolian_name = get_mongolian_name_by_english_name(english_name)
    return mongolian_name