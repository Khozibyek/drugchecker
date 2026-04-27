# backend/tests/test_explainer.py
"""
templates.csv-ийн бодит template-уудаар generate_mongolian_explanation() шалгана.
"""
from app.services.interaction_explainer import generate_mongolian_explanation

# ── Тест 1: "increase|serum|concentration" → template 6 ──────
def test_serum_concentration_template():
    desc = "Apixaban may increase the serum concentration of Lepirudin."
    result = generate_mongolian_explanation("Апиксабан", "Лепирудин", desc)
    assert result["keyword"] is not None
    assert "концентраци" in result["mn"]

# ── Тест 2: "decrease|excretion|rate" → template 1 ──────────
def test_excretion_rate_template():
    desc = "Drug A may decrease the excretion rate of Drug B."
    result = generate_mongolian_explanation("Апиксабан", "Лепирудин", desc)
    assert result["keyword"] is not None
    assert "ялгаралт" in result["mn"]

# ── Тест 3: Монгол эмийн нэр гаралтад орсон эсэх ─────────────
def test_drug_name_in_output():
    desc = "Drug A may increase the serum concentration of Drug B."
    result = generate_mongolian_explanation("Апиксабан", "Лепирудин", desc)
    assert "Апиксабан" in result["mn"] or "Лепирудин" in result["mn"]

# ── Тест 4: Keyword тохирохгүй → fallback буцаана ────────────
def test_no_match_returns_fallback():
    desc = "These two drugs were observed in clinical study."
    result = generate_mongolian_explanation("Апиксабан", "Лепирудин", desc)
    assert result["keyword"] is None
    assert "Апиксабан" in result["mn"]
    assert "Лепирудин" in result["mn"]

# ── Тест 5: Хоосон description → fallback ────────────────────
def test_empty_description_fallback():
    result = generate_mongolian_explanation("Апиксабан", "Лепирудин", "")
    assert result["keyword"] is None

# ── Тест 6: None description → алдаагүй ─────────────────────
def test_none_description_no_crash():
    result = generate_mongolian_explanation("Апиксабан", "Лепирудин", None)
    assert isinstance(result["mn"], str)

# ── Тест 7: AND логик — keyword бүгд байх ёстой ──────────────
def test_partial_keyword_no_match():
    # "increase" байгаа ч "serum", "concentration" байхгүй
    desc = "Drug A may increase the metabolism of Drug B."
    result = generate_mongolian_explanation("Апиксабан", "Лепирудин", desc)
    # template 6 тааруулахгүй — "increase" дангаараа хангалтгүй
    if result["keyword"]:
        assert "serum" not in result["keyword"] or "concentration" not in result["keyword"]