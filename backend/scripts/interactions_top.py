from __future__ import annotations

import csv
import re
from collections import Counter
from pathlib import Path
from typing import Dict, List, Any

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

SRC = DATA_DIR / "drug_interactions.csv"
OUT = DATA_DIR / "drug_interactions_top10.csv"


def read_rows(path: Path) -> List[dict]:
    if not path.exists():
        raise FileNotFoundError(f"CSV not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def build_id_to_name(rows: List[dict]) -> Dict[str, str]:
    id_to_name: Dict[str, str] = {}
    for r in rows:
        did = (r.get("drugbank_id") or "").strip()
        name = (r.get("drug_name") or "").strip()
        if did and name and did not in id_to_name:
            id_to_name[did] = name
    return id_to_name


def remove_names_keep_rest(desc: str, drug_a: str, drug_b: str) -> str:
    text = desc or ""
    names = [drug_a or "", drug_b or ""]
    names = [n.strip() for n in names if (n or "").strip()]
    names.sort(key=len, reverse=True)

    for name in names:
        text = re.sub(re.escape(name), "", text, flags=re.IGNORECASE)

    # key-г тогтвортой болгохын тулд зайг цэгцэлж байна (CSV-д бичих мөр өөрчлөгдөхгүй!)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def main() -> None:
    rows = read_rows(SRC)
    if not rows:
        print("Empty CSV.")
        return

    id_to_name = build_id_to_name(rows)

    key_counter = Counter()
    example_row_by_key: Dict[str, Dict[str, Any]] = {}

    # Count + first example row
    for r in rows:
        a_name = (r.get("drug_name") or "").strip()
        b_id = (r.get("interacts_with_id") or "").strip()
        b_name = id_to_name.get(b_id, "").strip()
        desc = r.get("description") or ""

        key = remove_names_keep_rest(desc, a_name, b_name)
        key_counter[key] += 1

        if key not in example_row_by_key:
            example_row_by_key[key] = r  # ✅ яг анхны мөрийг хадгална

    top100_keys = [k for k, _ in key_counter.most_common(10)]

    fieldnames = list(rows[0].keys())

    with OUT.open("w", encoding="utf-8", newline="") as out_f:
        w = csv.DictWriter(out_f, fieldnames=fieldnames)
        w.writeheader()

        for k in top100_keys:
            w.writerow(example_row_by_key[k])  # ✅ яг өөрчлөлтгүй мөр

    # Console report
    print(f"Done. Saved: {OUT}")
    print(f"Original rows: {len(rows)} | Unique types: {len(key_counter)}")
    print("Top 10 types (freq):")
    for k, freq in key_counter.most_common(10):
        print(freq, "=>", k)


if __name__ == "__main__":
    main()