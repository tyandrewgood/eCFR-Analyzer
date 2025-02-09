# backend/tests/test_app.py
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_analyze_without_agency():
    # Since 'agency' is required, not providing it should result in a validation error (422)
    response = client.get("/analyze")
    assert response.status_code == 422

def test_analyze_with_valid_agency():
    # Test with a known agency slug and query.
    agency_slug = "agriculture-department"
    response = client.get(f"/analyze?agency={agency_slug}&query=Agriculture")
    assert response.status_code == 200
    data = response.json()
    # Verify that the response contains the expected keys and non-zero counts.
    assert data.get("agency") == agency_slug
    assert "result_count" in data
    assert "word_count" in data
    # Optionally, you can check that result_count and word_count are > 0.
    assert data["result_count"] > 0
    assert data["word_count"] > 0
