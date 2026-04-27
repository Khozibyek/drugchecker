from app.services.drug_service import resolve_drug_id
from app.services.interaction_explainer import generate_mongolian_explanation
from app.services.severity_service import detect_severity
from app import data_loader as dl

def check_interaction(drug_a: str, drug_b: str) -> dict:
    """
    Хоёр эмийн харилцан үйлчлэлийг шалгана.

    Алхам:
      1. Монгол нэр → DrugBank ID
      2. ID хослолоор PAIR_META-с харилцан үйлчлэл хайна
      3. Олдвол монгол тайлбар үүсгэнэ
    """
    id_a = resolve_drug_id(drug_a)
    id_b = resolve_drug_id(drug_b)

    if not id_a:
        return {"error": f"'{drug_a}' эмийн нэр олдсонгүй"}
    if not id_b:
        return {"error": f"'{drug_b}' эмийн нэр олдсонгүй"}
    if id_a == id_b:
        return {"error": "Ижил эм хоорондын харилцан үйлчлэл шалгах боломжгүй"}

    key = tuple(sorted([id_a, id_b]))
    meta = dl.PAIR_META.get(key)

    if not meta:
        return {
            "has_interaction": False,
            "message": "Харилцан үйлчлэлийн мэдээлэл олдсонгүй"
        }
    
    desc = meta.get("description", "")
    if not desc:
        return {
        "has_interaction": True,
        "description_mn": "Харилцан үйлчлэлийн тайлбар байхгүй байна",
        "severity": meta.get("severity", "unknown"),
    }

    # interaction dataset дахь англи нэр
    drug_a_inn = dl.DBID_TO_NAME.get(meta["drug_a_id"], meta["drug_a_id"])
    drug_b_inn = dl.DBID_TO_NAME.get(meta["drug_b_id"], meta["drug_b_id"])

    # англи нэрийг монгол руу хөрвүүлэх
    drug_a_mn = dl.get_mongolian_name_by_english_name(drug_a_inn)
    drug_b_mn = dl.get_mongolian_name_by_english_name(drug_b_inn)
    print(f"[DEBUG] drug_a_inn: {drug_a_inn}")
    print(f"[DEBUG] drug_a_mn: {drug_a_mn}")
    print(f"[DEBUG] drug_b_inn: {drug_b_inn}")
    print(f"[DEBUG] drug_b_mn: {drug_b_mn}")
    print(f"[DEBUG] INN_TO_MN sample: {list(dl.INN_TO_MN.items())[:5]}")
    
    explanation = generate_mongolian_explanation(drug_a_mn, drug_b_mn, desc)
    severity_info = detect_severity(desc, drug_a_inn, drug_b_inn)
    
    return {
        "has_interaction": True,
        "severity": severity_info["severity_id"],
        "matched_keyword": explanation["keyword"],
        "description_en":  desc,
        "description_mn":  explanation["mn"],
        
        "drug_a_id":  meta["drug_a_id"],
        "drug_a_inn": drug_a_inn,
        "drug_a_mn":  drug_a_mn,

        "drug_b_id":  meta["drug_b_id"],
        "drug_b_inn": drug_b_inn,
        "drug_b_mn":  drug_b_mn,
    }