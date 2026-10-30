from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    issuer = Column(String(255), default="Coursera", nullable=False)
    issue_date = Column(String(50), default="", nullable=False)
    image_url = Column(String(500), default="", nullable=False)
    pdf_url = Column(String(500), default="", nullable=False)
    verification_url = Column(String(500), default="", nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    is_visible = Column(Boolean, default=False, nullable=False)
