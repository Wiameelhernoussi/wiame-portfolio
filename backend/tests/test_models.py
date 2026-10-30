import pytest
from app.models import (
    Profile,
    Project,
    Certificate,
    Skill,
    Experience,
    Education,
    AdminUser
)
from app.core.security import verify_password, get_password_hash


def test_admin_user_password_hashing(db_session):
    raw_password = "SecurePassword2027!"
    user = AdminUser(
        email="test@wiameelhernoussi.com",
        hashed_password=get_password_hash(raw_password),
        full_name="Wiame El Hernoussi"
    )
    db_session.add(user)
    db_session.commit()

    retrieved = db_session.query(AdminUser).filter_by(email="test@wiameelhernoussi.com").first()
    assert retrieved is not None
    assert verify_password(raw_password, retrieved.hashed_password)
    assert not verify_password("wrongPassword", retrieved.hashed_password)


def test_profile_empty_contact_and_real_socials(db_session):
    profile = Profile(
        full_name="Wiame El Hernoussi",
        title="Data & AI Engineering Student",
        pitch="Testing pitch",
        availability_badge="Open to internship",
        about_bio="Testing bio",
        email="",  # Left empty per user request
        phone="",  # Left empty per user request
        github_url="https://github.com/Wiameelhernoussi",
        linkedin_url="https://www.linkedin.com/in/wiameelhernoussi/"
    )
    db_session.add(profile)
    db_session.commit()

    saved = db_session.query(Profile).first()
    assert saved.email == ""
    assert saved.phone == ""
    assert "wiameelhernoussi" in saved.linkedin_url
    assert "Wiameelhernoussi" in saved.github_url


def test_certificate_default_visibility_hidden(db_session):
    cert = Certificate(
        title="Machine Learning",
        issuer="Coursera",
        verification_url="",
        is_visible=False  # Hidden per user request until link/image added
    )
    db_session.add(cert)
    db_session.commit()

    saved = db_session.query(Certificate).first()
    assert saved.is_visible is False
    assert saved.verification_url == ""


def test_project_model_markdown_and_json(db_session):
    proj = Project(
        title="SmartPark",
        slug="smartpark-ai",
        category="Computer Vision",
        short_description="Smart parking with YOLOv8",
        long_description="### Markdown Header\n* Bullet 1\n* Bullet 2",
        technologies=["YOLOv8", "LSTM", "FastAPI"],
        start_date="Feb 2026",
        end_date="May 2026",
        status="Completed",
        metrics=[{"label": "Accuracy", "value": "97.30%"}],
        links={"github": "https://github.com/Wiameelhernoussi/smartparkAI"}
    )
    db_session.add(proj)
    db_session.commit()

    saved = db_session.query(Project).filter_by(slug="smartpark-ai").first()
    assert saved is not None
    assert "### Markdown Header" in saved.long_description
    assert "YOLOv8" in saved.technologies
    assert saved.metrics[0]["value"] == "97.30%"
    assert saved.links["github"] == "https://github.com/Wiameelhernoussi/smartparkAI"
