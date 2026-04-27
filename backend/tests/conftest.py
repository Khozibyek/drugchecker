# backend/tests/conftest.py
import sys
import os

# backend/ хавтасыг Python path-д нэмнэ
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
import app.data_loader as dl

@pytest.fixture(scope="session", autouse=True)
def load_data():
    dl.load_csv()