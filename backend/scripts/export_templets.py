import csv
import re
from pathlib import Path

# -------------------------
# PATHS
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
SRC = BASE_DIR / "data" / "drug_interactions.csv"
OUT = BASE_DIR / "data" / "drug_interactions_cover_final.csv"

# -------------------------
# REGEX (compile once)
# -------------------------
WS_RE = re.compile(r"\s+")
TRAIL_DOT_RE = re.compile(r"[,\s]+\.$")
TRAIL_RE = re.compile(r"[,\s]+$")

# Normalize different phrases to "combined with"
COMBO_PHRASES = [
    (re.compile(r"\bwhen used in combination with\b", re.I), "when combined with"),
    (re.compile(r"\bwhen it is combined with\b", re.I), "when combined with"),
    (re.compile(r"\bco-?administered with\b", re.I), "combined with"),
    (re.compile(r"\bconcomitantly administered with\b", re.I), "combined with"),
    (re.compile(r"\badministered concomitantly with\b", re.I), "combined with"),
    (re.compile(r"\badministered with\b", re.I), "combined with"),
]

# Match "when X is combined with Y" (X/Y can be drug names or placeholders)
WHEN_COMBINED_RE = re.compile(
    r"\bwhen\s+(.+?)\s+is\s+combined\s+with\s+(.+?)(?:\.\s*|,\s*|;\s*|$)",
    re.I,
)

# Replace "combined with <something>" -> combined with DRUG_B (fallback for missing mapping)
COMBINED_WITH_OBJ_RE = re.compile(
    r"\bcombined with\b\s+(?!DRUG_[ABX])([A-Za-z0-9][A-Za-z0-9\-\s]*?)([.,;]|$)",
    re.I,
)

# Modal normalization (keep will/would as-is; only normalize may/can/could/might)
MODAL_RE = re.compile(r"\b(may|can|could|might)\b", re.I)

# increase/decrease unification (strong but safe)
INC_RE = re.compile(r"\b(increased|increases)\b", re.I)
DEC_RE = re.compile(r"\b(decreased|decreases)\b", re.I)
REDUCE_RE = re.compile(r"\b(reduced|reduces|reduce)\b", re.I)
ELEV_RE = re.compile(r"\b(elevated|elevates|elevate)\b", re.I)

# DRUG_X patterns (3rd drug object)
# stop when common verbs/preps start or punctuation ends
STOP = r"(?=\s+(?:can|may|could|might|will|is|are|has|have|to|and|or|by|in|of)\b|[.,;]|$)"

DRUGX_PATTERNS = [
    (re.compile(r"\bthe serum concentration of\b\s+(?!DRUG_[ABX])(.+?)" + STOP, re.I),
     "the serum concentration of DRUG_X"),
    (re.compile(r"\bthe therapeutic efficacy of\b\s+(?!DRUG_[ABX])(.+?)" + STOP, re.I),
     "the therapeutic efficacy of DRUG_X"),
    (re.compile(r"\bthe metabolism of\b\s+(?!DRUG_[ABX])(.+?)" + STOP, re.I),
     "the metabolism of DRUG_X"),
    (re.compile(r"\bthe serum levels? of\b\s+(?!DRUG_[ABX])(.+?)" + STOP, re.I),
     "the serum level of DRUG_X"),
    (re.compile(r"\bthe risk or severity of\b\s+(?!DRUG_[ABX])(.+?)" + STOP, re.I),
     "the risk or severity of DRUG_X"),
]

# -------------------------
# Helpers
# -------------------------
def norm_space(s: str) -> str:
    return WS_RE.sub(" ", s).strip()

def safe_lower(s: str) -> str:
    return s.lower() if isinstance(s, str) else ""

def replace_whole_word_insensitive(text: str, word: str, repl: str) -> str:
    """
    Replace whole-word occurrences case-insensitively.
    Optimization: check substring first on lowercase.
    """
    if not word:
        return text
    tl = text.lower()
    wl = word.lower()
    if wl not in tl:
        return text
    return re.sub(rf"\b{re.escape(word)}\b", repl, text, flags=re.I)

def normalize_template(desc: str, drugA_name: str | None, drugB_name: str | None) -> str:
    """
    Returns a canonical template string.
    Does NOT modify original output row; only used for dedupe key.
    """

    d = "" if desc is None else str(desc)

    # 0) whitespace normalize early
    d = norm_space(d)

    # 1) replace known A/B names -> placeholders (only if present)
    if drugA_name:
        d = replace_whole_word_insensitive(d, str(drugA_name), "DRUG_A")
    if drugB_name:
        d = replace_whole_word_insensitive(d, str(drugB_name), "DRUG_B")

    # 2) normalize combination phrases -> "combined with"
    for rx, rep in COMBO_PHRASES:
        d = rx.sub(rep, d)

    # 3) fallback: "combined with <something>" -> combined with DRUG_B
    # (this covers missing drugB_name mapping cases)
    d = COMBINED_WITH_OBJ_RE.sub(r"combined with DRUG_B\2", d)

    # 4) DRUG_X patterns (3rd object drug)
    for rx, rep in DRUGX_PATTERNS:
        d = rx.sub(rep, d)

    # 5) canonicalize "when X is combined with Y" direction
    # After step 1/3, X/Y are usually DRUG_A / DRUG_B or leftover text
    m = WHEN_COMBINED_RE.search(d)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()

        # If swapped, force canonical: DRUG_A combined with DRUG_B
        # Recognize placeholders anywhere in left/right:
        # Examples: "DRUG_B" + "DRUG_A" or vice versa.
        if ("DRUG_B" in left and "DRUG_A" in right):
            d = WHEN_COMBINED_RE.sub("when DRUG_A is combined with DRUG_B.", d)
        elif ("DRUG_A" in left and "DRUG_B" in right):
            d = WHEN_COMBINED_RE.sub("when DRUG_A is combined with DRUG_B.", d)
        else:
            # If not clearly A/B, still normalize structure:
            d = WHEN_COMBINED_RE.sub("when DRUG_A is combined with DRUG_B.", d)

    # 6) modal + increase/decrease unify
    d = MODAL_RE.sub("can", d)
    d = INC_RE.sub("increase", d)
    d = ELEV_RE.sub("increase", d)
    d = DEC_RE.sub("decrease", d)
    d = REDUCE_RE.sub("decrease", d)

    # 7) final normalize: lowercase, spaces, trailing punctuation
    d = safe_lower(d)
    d = norm_space(d)
    d = TRAIL_DOT_RE.sub(".", d)
    d = TRAIL_RE.sub("", d)

    return d

# -------------------------
# Pass 1: build id->name map
# -------------------------
def build_id_to_name(csv_path: Path) -> dict:
    id_to_name = {}
    with open(csv_path, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        # required columns
        need = {"drugbank_id", "drug_name"}
        if not need.issubset(reader.fieldnames or []):
            raise ValueError(f"CSV header missing required columns: {need}. Found: {reader.fieldnames}")

        for row in reader:
            did = row.get("drugbank_id")
            name = row.get("drug_name")
            if did and name and did not in id_to_name:
                id_to_name[did] = name
    return id_to_name

# -------------------------
# Pass 2: stream + dedupe by template, write original rows
# -------------------------
def export_cover(csv_path: Path, out_path: Path):
    print("SRC:", csv_path)
    print("OUT:", out_path)

    print("\n[Pass 1] Building id->name map...")
    id_to_name = build_id_to_name(csv_path)
    print("Mapped IDs:", f"{len(id_to_name):,}")

    seen = set()

    total = 0
    kept = 0
    missing_b = 0
    bad_rows = 0

    with open(csv_path, "r", newline="", encoding="utf-8") as fin, \
         open(out_path, "w", newline="", encoding="utf-8") as fout:

        reader = csv.DictReader(fin)
        fieldnames = reader.fieldnames or []
        need = {"drugbank_id", "drug_name", "interacts_with_id", "description"}
        if not need.issubset(fieldnames):
            raise ValueError(f"CSV header missing required columns: {need}. Found: {fieldnames}")

        writer = csv.DictWriter(fout, fieldnames=["drugbank_id", "drug_name", "interacts_with_id", "description"])
        writer.writeheader()

        print("\n[Pass 2] Streaming + template-dedupe...")
        for row in reader:
            total += 1

            try:
                a_id = row.get("drugbank_id")
                a_name = row.get("drug_name")
                b_id = row.get("interacts_with_id")
                desc = row.get("description")

                b_name = id_to_name.get(b_id)
                if not b_name:
                    missing_b += 1

                tmpl = normalize_template(desc, a_name, b_name)

                if tmpl in seen:
                    continue

                seen.add(tmpl)
                kept += 1

                # ✅ output original row (do not alter text/case)
                writer.writerow({
                    "drugbank_id": a_id,
                    "drug_name": a_name,
                    "interacts_with_id": b_id,
                    "description": desc,
                })

            except Exception:
                bad_rows += 1
                continue

            # light progress (every 1,000,000 rows)
            if total % 1_000_000 == 0:
                print(f"  processed={total:,} kept={kept:,} missingB={missing_b:,} bad={bad_rows:,}")

    print("\nDone.")
    print("Total rows :", f"{total:,}")
    print("Kept rows  :", f"{kept:,}")          # ✅ энэ нь final unique template тоо
    print("Missing B  :", f"{missing_b:,}")
    print("Bad rows   :", f"{bad_rows:,}")
    print("Saved to   :", out_path)

def main():
    export_cover(SRC, OUT)

if __name__ == "__main__":
    main()