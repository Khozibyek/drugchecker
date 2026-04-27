import app.data_loader as dl

SEVERITY_LABELS = {
    "MAJOR": "Өндөр",
    "MODERATE": "Дунд",
    "MINOR": "Бага",
    "UNKNOWN": "Тодорхойгүй",
}


def detect_severity(
    description: str = "",
    drug_a_inn: str = "",
    drug_b_inn: str = "",
) -> dict:
    """
    Эрсдлийн түвшин тодорхойлно:
      1. Эхлээд DDinter-аас INN хосоор хайна
      2. Олдохгүй бол тайлбараас түлхүүр үгээр хайна
    """
    default_result = {
        "severity_id": "UNKNOWN",
        "severity_label": "Тодорхойгүй",
        "matched_keyword": None,
        "source": "none",
    }

    # 1. DDinter-аас INN хосоор хайх
    if drug_a_inn and drug_b_inn:
        a = drug_a_inn.strip().lower()
        b = drug_b_inn.strip().lower()
        pair = tuple(sorted([a, b]))
        ddinter_level = dl.DDINTER_SEVERITY.get(pair)

        if ddinter_level:
            level_upper = ddinter_level.upper()
            print(f"[INFO] DDinter тааруулга: {pair} → {ddinter_level}")
            return {
                "severity_id": level_upper,
                "severity_label": SEVERITY_LABELS.get(level_upper, "Тодорхойгүй"),
                "matched_keyword": None,
                "source": "ddinter",
            }

    # 2. Keyword-аар хайх
    desc = (description or "").lower().strip()
    if not desc or not dl.SEVERITY_RULES:
        return default_result

    rules_by_id = {}
    for r in dl.SEVERITY_RULES:
        rid = (r.get("severity_id") or "").upper().strip()
        if rid:
            rules_by_id[rid] = r

    for rid in ["MAJOR", "MODERATE", "MINOR"]:
        rule = rules_by_id.get(rid)
        if not rule:
            continue

        label = (rule.get("severity_label") or "Тодорхойгүй").strip()
        raw_keywords = rule.get("keywords", "")
        keywords = [
            kw.lower().strip() for kw in raw_keywords.split(";") if kw.strip()
        ]

        for keyword in keywords:
            if keyword in desc:
                return {
                    "severity_id": rid,
                    "severity_label": label,
                    "matched_keyword": keyword,
                    "source": "keyword",
                }

    return default_result