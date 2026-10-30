from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Index
from app.db.base import Base


class RateLimitEntry(Base):
    __tablename__ = "rate_limits"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(255), nullable=False, index=True)  # e.g., "login:192.168.1.1" or "contact:ip"
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    __table_args__ = (
        Index("idx_rate_limit_key_timestamp", "key", "timestamp"),
    )
