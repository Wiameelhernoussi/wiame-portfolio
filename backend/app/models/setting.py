from sqlalchemy import Column, Integer, String, Text, JSON
from app.db.base import Base


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    site_title = Column(String(255), default="Wiame El Hernoussi – Data & AI Engineer", nullable=False)
    meta_description = Column(
        Text,
        default="Portfolio of Wiame El Hernoussi, final-year Data & AI Engineering student at EMSI Marrakech looking for an end-of-studies internship from February 2027.",
        nullable=False
    )
    keywords = Column(String(500), default="Data Engineer, AI Engineer, Machine Learning, Deep Learning, LLM Agents, RAG, YOLO, Computer Vision, FastAPI, React", nullable=False)
    og_image_url = Column(String(500), default="/og-preview.png", nullable=False)
    accent_color = Column(String(20), default="#E9A21F", nullable=False)
    primary_color = Column(String(20), default="#2B3FA3", nullable=False)
    section_visibility = Column(
        JSON,
        default=lambda: {
            "hero": True,
            "about": True,
            "projects": True,
            "experience": True,
            "skills": True,
            "certificates": True,
            "education": True,
            "interests": True,
            "contact": True
        },
        nullable=False
    )
