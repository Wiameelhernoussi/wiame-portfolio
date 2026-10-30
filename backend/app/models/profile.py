from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from app.db.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), default="Wiame El Hernoussi", nullable=False)
    title = Column(String(255), default="Data & AI Engineering Student", nullable=False)
    pitch = Column(
        Text,
        default="Final-year engineering student in Data & AI. I take projects from raw data to a working product: pipelines, models, APIs and the interface people actually use.",
        nullable=False
    )
    availability_badge = Column(
        String(255),
        default="Open to an end-of-studies internship from February 2027",
        nullable=False
    )
    about_bio = Column(
        Text,
        default="I am a final-year Data & AI engineering student at EMSI Marrakech (AI/Data track), passionate about building complete, impactful AI systems from raw data pipelines to deployed intelligent products.",
        nullable=False
    )
    location = Column(String(255), default="Marrakech, Morocco (Open to Morocco & International Relocation)")
    
    # Contact details: left empty per instructions until filled in admin
    email = Column(String(255), default="", nullable=False)
    phone = Column(String(255), default="", nullable=False)

    # Social links
    github_url = Column(String(255), default="https://github.com/Wiameelhernoussi")
    linkedin_url = Column(String(255), default="https://www.linkedin.com/in/wiameelhernoussi/")

    # Documents & Media
    cv_url = Column(String(500), default="", nullable=False)
    avatar_url = Column(String(500), default="assets/profile.png", nullable=False)

    # Structured metadata
    key_figures = Column(JSON, default=list)  # e.g. [{"label": "...", "value": "...", "sub": "..."}]
    languages = Column(JSON, default=list)    # e.g. [{"language": "Arabic", "level": "Native"}, ...]
    interests = Column(JSON, default=list)    # e.g. ["Basketball", "Strength training", "Reading"]
    social_links = Column(JSON, default=dict) # e.g. {"kaggle": "", "twitter": ""}

    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
