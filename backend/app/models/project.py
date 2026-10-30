from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, DateTime
from app.db.base import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False, default="AI & Machine Learning")
    short_description = Column(Text, nullable=False)
    long_description = Column(Text, nullable=False)  # Full Markdown documentation
    technologies = Column(JSON, default=list, nullable=False)  # List of tech tags
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=False)
    status = Column(String(50), default="Completed", nullable=False)  # "Completed" or "Ongoing"
    is_featured = Column(Boolean, default=False, nullable=False)
    cover_image = Column(String(500), default="", nullable=False)
    gallery_images = Column(JSON, default=list, nullable=False)  # [{"url": "...", "caption": "...", "order": 0}]
    metrics = Column(JSON, default=list, nullable=False)  # [{"label": "Accuracy", "value": "97.30%"}, ...]
    links = Column(JSON, default=dict, nullable=False)  # {"github": "...", "demo": "...", "video": "...", "pdf": "..."}
    order_index = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
