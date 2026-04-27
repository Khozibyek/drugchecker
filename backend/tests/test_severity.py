# backend/tests/test_severity.py
"""
severity_rules.csv-ийн бодит өгөгдлөөр detect_severity() шалгана.
Бодит CSV-ийн description-уудаар тест хийнэ.
"""
from app.services.severity_service import detect_severity

# ── Тест 1: MAJOR — бодит drug_interactions description ──────
def test_major_bleeding_hemorrhage():
    desc = "The risk or severity of bleeding and hemorrhage can be increased when Dasatinib is combined with Lepirudin."
    result = detect_severity(desc)
    assert result["severity_id"] == "MAJOR"

# ── Тест 2: MAJOR — "fatal" keyword ──────────────────────────
def test_major_fatal():
    desc = "This combination may produce a fatal outcome in overdose."
    result = detect_severity(desc)
    assert result["severity_id"] == "MAJOR"

# ── Тест 3: MODERATE — бодит description ─────────────────────
def test_moderate_increase_activities():
    desc = "Apixaban may increase the anticoagulant activities of Lepirudin."
    result = detect_severity(desc)
    assert result["severity_id"] == "MODERATE"

# ── Тест 4: MODERATE — "decrease" keyword ────────────────────
def test_moderate_decrease():
    desc = "Drug A may decrease the serum concentration of Drug B."
    result = detect_severity(desc)
    assert result["severity_id"] == "MODERATE"

# ── Тест 5: MINOR — "reduce therapeutic efficacy" ────────────
def test_minor_reduce_efficacy():
    desc = "Drug A may reduce therapeutic efficacy of Drug B."
    result = detect_severity(desc)
    assert result["severity_id"] == "MINOR"

# ── Тест 6: Хоосон → UNKNOWN ─────────────────────────────────
def test_empty_returns_unknown():
    result = detect_severity("")
    assert result["severity_id"] == "UNKNOWN"

# ── Тест 7: None → UNKNOWN ───────────────────────────────────
def test_none_returns_unknown():
    result = detect_severity(None)
    assert result["severity_id"] == "UNKNOWN"

# ── Тест 8: MAJOR > MODERATE давуу эрэмбэ ───────────────────
def test_major_prioritized_over_moderate():
    desc = "fatal increase in anticoagulant risk"
    result = detect_severity(desc)
    assert result["severity_id"] == "MAJOR"

# ── Тест 9: matched_keyword буцаасан эсэх ────────────────────
def test_matched_keyword_returned():
    desc = "Apixaban may increase the anticoagulant activities of Lepirudin."
    result = detect_severity(desc)
    assert result["matched_keyword"] is not None