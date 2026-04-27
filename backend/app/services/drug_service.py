from app import data_loader as dl

def resolve_drug_id(mn_or_inn: str) -> str | None:
    """
    Монгол (mn) эсвэл INN нэрээр DrugBank ID-г буцаана.
    """
    mn_or_inn = mn_or_inn.strip().lower()

    inn = dl.MN_TO_INN.get(mn_or_inn, mn_or_inn)
    drug_id = dl.NAME_TO_DBID.get(inn)

    return drug_id