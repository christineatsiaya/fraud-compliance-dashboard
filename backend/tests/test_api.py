# import
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_states():
    response = client.get("/states")
    assert response.status_code == 200

def test_get_risk_scores():
    response = client.get("/risk/risk-scores")
    assert response.status_code == 200
 