#!/usr/bin/env python3
# report_dedup_stats.py

from __future__ import annotations

import csv
import re
from collections import Counter
from pathlib import Path
from typing import Dict, List, Set


# -------------------------
# PATH: өөрийн data руу тааруулаад солиорой
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent   # scripts/ -> backend/
DATA_DIR = BASE_DIR / "data"
SRC = DATA_DIR / "drug_interactions_copy.csv"


def read_rows(path: Path) -> List[dict]:
    if not path.exists():
        raise FileNotFoundError(f"CSV not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def build_id_to_name(rows: List[dict]) -> Dict[str, str]:
    """drugbank_id -> drug_name (эхний таарсныг авна)"""
    id_to_name: Dict[str, str] = {}
    for r in rows:
        did = (r.get("drugbank_id") or "").strip()
        name = (r.get("drug_name") or "").strip()
        if did and name and did not in id_to_name:
            id_to_name[did] = name
    return id_to_name


def remove_names_keep_rest(desc: str, drug_a: str, drug_b: str) -> str:
    """
    Description-оос 2 эмийн нэрийг *хасаад* үлдсэнийг яг хэвээр нь буцаана.
    (давхардал шалгах key)
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
        print("CSV хоосон байна.")
        return

    id_to_name = build_id_to_name(rows)

    total = len(rows)

    # Counters
    missing_a_name = 0
    missing_b_id = 0
    missing_b_name = 0
    missing_desc = 0

    seen: Set[str] = set()
    key_counter = Counter()

    for r in rows:
        a_name = (r.get("drug_name") or "").strip()
        b_id = (r.get("interacts_with_id") or "").strip()
        desc = r.get("description") or ""

        if not a_name:
            missing_a_name += 1
        if not b_id:
            missing_b_id += 1
        if not desc.strip():
            missing_desc += 1

        b_name = id_to_name.get(b_id, "").strip()
        if b_id and not b_name:
            missing_b_name += 1

        key = remove_names_keep_rest(desc, a_name, b_name)
        seen.add(key)
        key_counter[key] += 1

    kept = len(seen)
    duplicates = total - kept

    # Basic report
    print("==== DEDUP REPORT (no file written) ====")
    print("SRC:", SRC)
    print(f"Original rows: {total}")
    print(f"Kept (unique after removing drug names): {kept}")
    print(f"Duplicates (would be removed): {duplicates}")
    print()

    print("---- Data quality checks ----")
    print(f"Missing drug_name (A): {missing_a_name}")
    print(f"Missing interacts_with_id (B id): {missing_b_id}")
    print(f"B name NOT found via ID->name map: {missing_b_name}  (only counted when B id exists)")
    print(f"Missing/empty description: {missing_desc}")
    print()

    # Optional: show the most frequent keys (sentence types)
    print("---- Top 20 most frequent sentence types (after removing drug names) ----")
    for k, v in key_counter.most_common(20):
        # k нь хоосон байж болох тул нэг мөр болгон харуулна
        k_show = k.replace("\n", " ").replace("\r", " ")
        if len(k_show) > 140:
            k_show = k_show[:140] + "..."
        print(f"{v:>8}  |  {k_show}")

    # Coverage summary
    found_b_name = (total - missing_b_id) - missing_b_name
    if total - missing_b_id > 0:
        rate = found_b_name / (total - missing_b_id) * 100
    else:
        rate = 0.0

    print()
    print("---- Mapping coverage ----")
    print(f"B name found: {found_b_name} / {total - missing_b_id} ({rate:.2f}%)  (among rows with B id)")

    print("========================================")


if __name__ == "__main__":
    main()