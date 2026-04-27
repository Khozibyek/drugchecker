# backend/tests/test_interaction.py
"""
check_interaction() функцийг шалгана.
Бодит CSV-д байгаа: Варфарин (Warfarin) ↔ Этанерцепт (Etanercept)
"""
from app.services.interaction_service import check_interaction

# ── Тест 1: Харилцан үйлчлэл байгаа хос ─────────────────────
def test_known_pair_has_interaction():
    result = check_interaction("Варфарин", "Этанерцепт")
    assert result.get("has_interaction") is True

# ── Тест 2: description_mn монгол тайлбар байгаа эсэх ────────
def test_has_mongolian_description():
    result = check_interaction("Варфарин", "Этанерцепт")
    assert "description_mn" in result
    assert len(result["description_mn"]) > 0

# ── Тест 3: severity буцаасан эсэх ───────────────────────────
def test_has_severity():
    result = check_interaction("Варфарин", "Этанерцепт")
    assert result.get("severity") in ("MAJOR", "MODERATE", "MINOR", "UNKNOWN")

# ── Тест 4: Монгол эмийн нэр буцаасан эсэх ───────────────────
def test_has_mongolian_drug_names():
    result = check_interaction("Варфарин", "Этанерцепт")
    assert "drug_a_mn" in result
    assert "drug_b_mn" in result

# ── Тест 5: Байхгүй эм → error ───────────────────────────────
def test_unknown_drug_returns_error():
    result = check_interaction("Байхгүй эм", "Варфарин")
    assert "error" in result

# ── Тест 6: Ижил эм → error ──────────────────────────────────
def test_same_drug_returns_error():
    result = check_interaction("Варфарин", "Варфарин")
    assert "error" in result

# ── Тест 7: Хос дэс дараа хамаарахгүй (A,B = B,A) ───────────
def test_order_independent():
    r1 = check_interaction("Варфарин", "Этанерцепт")
    r2 = check_interaction("Этанерцепт", "Варфарин")
    assert r1.get("has_interaction") == r2.get("has_interaction")

    