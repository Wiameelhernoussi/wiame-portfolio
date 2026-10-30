from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base


class AnalyticsVisit(Base):
    __tablename__ = "analytics_visits"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(255), default="/", nullable=False)
    referrer = Column(String(500), default="", nullable=False)
    ip_hash = Column(String(64), nullable=False, index=True)  # SHA-256 anonymized, no cookies
    user_agent = Column(String(500), default="", nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
