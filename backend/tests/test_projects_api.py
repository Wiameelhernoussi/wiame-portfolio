import pytest
from app.models.project import Project
from app.core.config import settings


def get_admin_token(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": settings.FIRST_SUPERUSER_EMAIL,
            "password": settings.FIRST_SUPERUSER_PASSWORD
        }
    )
    return login_resp.json()["access_token"]


def test_public_projects_listing_and_filtering(client, db_session):
    p1 = Project(
        title="Royal Mansour Virtual Concierge",
        slug="royal-mansour",
        category="Generative AI & LLM Agents",
        short_description="Multilingual hotel concierge assistant",
        long_description="Concierge long markdown details",
        technologies=["LLM Agents", "RAG", "FastAPI"],
        start_date="Jul 2026",
        end_date="Sep 2026",
        is_featured=True,
        is_published=True,
        order_index=1
    )
    p2 = Project(
        title="SmartPark",
        slug="smartpark-ai",
        category="Computer Vision",
        short_description="Parking bay detection using YOLOv8",
        long_description="SmartPark long markdown details",
        technologies=["YOLOv8", "LSTM", "React PWA"],
        start_date="Feb 2026",
        end_date="May 2026",
        is_featured=False,
        is_published=True,
        order_index=2
    )
    p3_draft = Project(
        title="Unpublished Draft Project",
        slug="draft-project",
        category="Research",
        short_description="Draft description",
        long_description="Draft markdown",
        technologies=["Python"],
        start_date="2026",
        end_date="2026",
        is_published=False,
        order_index=3
    )
    db_session.add_all([p1, p2, p3_draft])
    db_session.commit()

    # 1. Public listing only returns published projects
    resp = client.get("/api/v1/projects")
    assert resp.status_code == 200
    slugs = [p["slug"] for p in resp.json()]
    assert "royal-mansour" in slugs
    assert "smartpark-ai" in slugs
    assert "draft-project" not in slugs

    # 2. Filter by technology
    resp_tech = client.get("/api/v1/projects?technology=YOLOv8")
    assert resp_tech.status_code == 200
    assert len(resp_tech.json()) == 1
    assert resp_tech.json()[0]["slug"] == "smartpark-ai"

    # 3. Search query
    resp_search = client.get("/api/v1/projects?search=concierge")
    assert resp_search.status_code == 200
    assert len(resp_search.json()) == 1
    assert resp_search.json()[0]["slug"] == "royal-mansour"

    # 4. By slug with navigation
    resp_slug = client.get("/api/v1/projects/by-slug/royal-mansour")
    assert resp_slug.status_code == 200
    data = resp_slug.json()
    assert data["title"] == "Royal Mansour Virtual Concierge"
    assert data["navigation"]["next_slug"] == "smartpark-ai"


def test_admin_projects_crud(client):
    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # Create project
    create_payload = {
        "title": "Autonomous Drone Defect Detection",
        "category": "Computer Vision",
        "short_description": "VLM and YOLOv11s defect detection",
        "long_description": "Detailed markdown for drone defects",
        "technologies": ["YOLOv11", "VLM"],
        "start_date": "Ongoing",
        "end_date": "2026",
        "is_published": True
    }
    create_resp = client.post("/api/v1/projects/admin", json=create_payload, headers=headers)
    assert create_resp.status_code == 201
    created_id = create_resp.json()["id"]
    assert create_resp.json()["slug"] == "autonomous-drone-defect-detection"

    # Update project
    update_payload = {"title": "Updated Drone Inspection Project"}
    update_resp = client.put(f"/api/v1/projects/admin/{created_id}", json=update_payload, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Updated Drone Inspection Project"

    # Delete project
    del_resp = client.delete(f"/api/v1/projects/admin/{created_id}", headers=headers)
    assert del_resp.status_code == 204
