from app import data_loader as dl
from app.utils.mn_suffix import add_suffix


def generate_mongolian_explanation(drug_a_mn: str, drug_b_mn: str, description: str) -> dict:
    """
    Англи тайлбараас keyword тааруулж монгол тайлбар үүсгэнэ.

    Алхам:
      1. Тайлбарыг жижиг үсэг болгоно
      2. Template бүрийн keyword-тай тааруулна
      3. Тааруулсан template-д эмийн нэр оруулж монгол тайлбар үүсгэнэ
      4. Олдохгүй бол ерөнхий тайлбар буцаана
    """
    desc_lower = (description or "").strip().lower()
    print(f"[DEBUG] desc_lower: {desc_lower[:100]}")
    print(f"[DEBUG] TEMPLATES тоо: {len(dl.TEMPLATES)}")

    for row in dl.TEMPLATES:
        raw_keywords = (row.get("keywords") or "").strip().lower()
        keywords = [k.strip() for k in raw_keywords.split("|") if k.strip()]
        print(f"[DEBUG] keyword: {keywords}")

        if not keywords:
            print(f"[WARN] Template-д keyword байхгүй: {row}")
            continue

        if not all(k in desc_lower for k in keywords):
            continue

        template = row.get("template") or ""

        try:
            text = template.format(
                drugA=drug_a_mn,
                drugB=drug_b_mn,
                drugA_comitative=add_suffix(drug_a_mn, "comitative"),
                drugB_comitative=add_suffix(drug_b_mn, "comitative"),
                drugA_genitive=add_suffix(drug_a_mn, "genitive"),
                drugB_genitive=add_suffix(drug_b_mn, "genitive"),
                drugA_accusative=add_suffix(drug_a_mn, "accusative"),
                drugB_accusative=add_suffix(drug_b_mn, "accusative"),
            )
        except KeyError as e:
            print(f"[WARN] Template format алдаа: {e}, template: {template}")
            continue

        return {
            "mn": text,
            "keyword": " | ".join(keywords),
        }

    return {
        "mn": f"{drug_a_mn} болон {drug_b_mn} эмүүдийг хамт хэрэглэхэд харилцан үйлчлэл илэрч болзошгүй.",
        "keyword": None,
    }