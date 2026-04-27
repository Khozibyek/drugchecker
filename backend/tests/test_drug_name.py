# backend/tests/test_drug_name.py
"""
drug_name_map.csv-ийн бодит өгөгдлөөр эмийн нэр олдох эсэхийг шалгана.
"""
import app.data_loader as dl

# ── Тест 1: Монгол нэр MN_TO_INN-д байгаа эсэх ──────────────
def test_mongolian_name_exists_in_map():
    assert "ацетилсалицилийн хүчил" in dl.MN_TO_INN

# ── Тест 2: Монгол нэр → INN зөв холбогдсон эсэх ────────────
def test_mongolian_to_inn_mapping():
    inn = dl.MN_TO_INN.get("ацетилсалицилийн хүчил")
    assert inn is not None
    assert inn.lower() == "acetylsalicylic acid"

# ── Тест 3: INN → Монгол нэр буцаана ─────────────────────────
def test_inn_to_mongolian_mapping():
    mn = dl.INN_TO_MN.get("acetylsalicylic acid")
    assert mn is not None
    assert "ацетилсалицилийн" in mn.lower()

# ── Тест 4: Байхгүй нэр None буцаана ────────────────────────
def test_unknown_drug_returns_none():
    result = dl.MN_TO_INN.get("байхгүй эм")
    assert result is None

# ── Тест 5: MN_TO_INN хоосон биш ────────────────────────────
def test_drug_map_loaded():
    assert len(dl.MN_TO_INN) > 0

# ── Тест 6: INN_TO_MN хоосон биш ────────────────────────────
def test_inn_map_loaded():
    assert len(dl.INN_TO_MN) > 0