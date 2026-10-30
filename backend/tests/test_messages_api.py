import pytest
from app.models.message import ContactMessage
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


def test_contact_form_valid_submission(client, db_session):
    payload = {
        "name": "Jane Recruiter",
        "email": "jane@techcompany.com",
        "subject": "End-of-Studies Internship Opportunity",
        "message": "Hello Wiame, we were impressed by your SmartPark and Royal Mansour projects...",
        "honeypot": ""
    }
    resp = client.post("/api/v1/messages", json=payload)
    assert resp.status_code == 201
    assert resp.json()["success"] is True

    # Verify message was saved to database
    saved = db_session.query(ContactMessage).filter_by(email="jane@techcompany.com").first()
    assert saved is not None
    assert saved.name == "Jane Recruiter"
    assert saved.is_read is False


def test_contact_form_honeypot_spam_dropped(client, db_session):
    spam_payload = {
        "name": "Spam Bot",
        "email": "bot@spammer.com",
        "subject": "Buy cheap backlinks",
        "message": "Click this spam link immediately...",
        "honeypot": "https://spamlink.com"  # Bot fills hidden field
    }
    resp = client.post("/api/v1/messages", json=spam_payload)
    assert resp.status_code == 201  # Fakes 201 to fool bot

    # Verify message was NOT saved to database
    saved = db_session.query(ContactMessage).filter_by(email="bot@spammer.com").first()
    assert saved is None


def test_admin_messages_lifecycle(client, db_session):
    # Add a message to DB
    msg = ContactMessage(
        name="Alex Hiring Manager",
        email="alex@ai-agency.com",
        subject="AI Internship 2027",
        message="Let's schedule an interview",
        is_read=False
    )
    db_session.add(msg)
    db_session.commit()

    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Admin lists messages
    list_resp = client.get("/api/v1/messages/admin/all", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1

    # 2. Mark as read
    read_resp = client.put(f"/api/v1/messages/admin/{msg.id}/read", headers=headers)
    assert read_resp.status_code == 200
    assert read_resp.json()["is_read"] is True

    # 3. Delete message
    del_resp = client.delete(f"/api/v1/messages/admin/{msg.id}", headers=headers)
    assert del_resp.status_code == 204
