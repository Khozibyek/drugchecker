from __future__ import annotations

import csv
import re
from pathlib import Path
from typing import Dict, List, Set

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
DATA_DIR = BASE_DIR / "data"

SRC = DATA_DIR / "drug_interactions_copy.csv"
OUT = DATA_DIR / "drug_interactions_cover3.csv"


def read_rows(path: Path) -> List[dict]:
    if not path.exists():
        raise FileNotFoundError(f"CSV not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def build_id_to_name(rows: List[dict]) -> Dict[str, str]:
    """
    drugbank_id -> drug_name mapping
    """
    id_to_name: Dict[str, str] = {}
    for r in rows:
        did = (r.get("drugbank_id") or "").strip()
        name = (r.get("drug_name") or "").strip()
        if did and name and did not in id_to_name:
            id_to_name[did] = name
    return id_to_name


def remove_names_keep_rest(desc: str, drug_a: str, drug_b: str) -> str:
    """
    Description-оос эмийн 2 нэрийг *хасаад* үлдсэн өгүүлбэрийг нь буцаана.
    (давхардал шалгах key-г үүсгэхэд ашиглана)
    """
    text = desc or ""

    names = [drug_a or "", drug_b or ""]
    names = [n for n in (n.strip() for n in names) if n]
    names.sort(key=len, reverse=True)

    for name in names:
        text = re.sub(re.escape(name), "", text, flags=re.IGNORECASE)

    return text


def main() -> None:
    rows = read_rows(SRC)
    if not rows:
        print("Empty CSV. Nothing to do.")
        return

    id_to_name = build_id_to_name(rows)

    seen: Set[str] = set()  
    kept = 0

    fieldnames = list(rows[0].keys())

    with OUT.open("w", encoding="utf-8", newline="") as out_f:
        w = csv.DictWriter(out_f, fieldnames=fieldnames)
        w.writeheader()

        for r in rows:
            drug_a_name = (r.get("drug_name") or "").strip()
            drug_b_id = (r.get("interacts_with_id") or "").strip()
            drug_b_name = id_to_name.get(drug_b_id, "").strip()

            desc = r.get("description") or ""

            key = remove_names_keep_rest(desc, drug_a_name, drug_b_name)

            if key in seen:
                continue

            seen.add(key)

            w.writerow(r)
            kept += 1
            

    print(f"Done. Saved: {OUT}")
    print(f"Original: {len(rows)} | Kept: {kept}")


if __name__ == "__main__":
    main()