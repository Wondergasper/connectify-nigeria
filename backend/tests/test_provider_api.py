import pytest
from fastapi import status

def test_get_provider_dashboard(client, test_provider, test_job):
    response = client.get("/api/v1/provider/dashboard")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "stats" in data
    assert "recentJobs" in data
    assert "upcomingJobs" in data
    assert data["stats"]["totalJobs"] >= 1

def test_get_provider_jobs(client, test_provider, test_job):
    response = client.get("/api/v1/provider/jobs")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "jobs" in data
    assert "total" in data
    assert len(data["jobs"]) >= 1
    assert data["jobs"][0]["title"] == "Test Job"

def test_update_job_status(client, test_provider, test_job):
    response = client.patch(
        f"/api/v1/provider/jobs/{test_job.id}/status",
        json={"status": "completed"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "completed"

def test_get_provider_profile(client, test_provider):
    response = client.get("/api/v1/provider/profile")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Test Provider"
    assert data["email"] == "test@example.com"
    assert "plumbing" in data["services"]
    assert "electrical" in data["services"]

def test_update_provider_profile(client, test_provider):
    update_data = {
        "name": "Updated Provider",
        "phone": "+2348098765432",
        "services": ["plumbing", "electrical", "hvac"]
    }
    response = client.put("/api/v1/provider/profile", json=update_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Updated Provider"
    assert data["phone"] == "+2348098765432"
    assert "hvac" in data["services"]

def test_get_provider_analytics(client, test_provider, test_job):
    response = client.get("/api/v1/provider/analytics")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "bookings" in data
    assert "revenue" in data
    assert "ratings" in data
    assert "bookings" in data["bookings"]
    assert "trend" in data["revenue"]

def test_get_provider_earnings(client, test_provider, test_job):
    response = client.get("/api/v1/provider/earnings")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "total_earnings" in data
    assert "pending_earnings" in data
    assert "earnings_trend" in data
    assert "recent_transactions" in data
    assert "monthly_earnings" in data
    assert "weekly_earnings" in data
    assert "service_earnings" in data 