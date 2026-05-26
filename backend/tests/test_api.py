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

def test_ai_copilot_fallback_response(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    response = client.post(
        "/ai/compliance-copilot",
        json={
            "question_id": "highest-review",
            "active_role": "executive",
            "selected_state": None,
            "states": [
                {
                    "state_code": "CA",
                    "risk_score": 91.4,
                    "revenue_at_risk": 18400000,
                    "risk_tier": "HIGH",
                },
                {
                    "state_code": "TX",
                    "risk_score": 74.8,
                    "revenue_at_risk": 13200000,
                    "risk_tier": "MEDIUM",
                },
            ],
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["source"] == "fallback"
    assert "CA" in payload["summary"]
    assert len(payload["risk_drivers"]) >= 2
    assert len(payload["recommended_actions"]) >= 2
    assert "deterministic" in payload["confidence_note"].lower()
