from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base


class Education(Base):
    __tablename__ = "educations"

    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=False)
    description = Column(Text, default="", nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
