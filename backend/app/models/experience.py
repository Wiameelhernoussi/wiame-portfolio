from sqlalchemy import Column, Integer, String, Text, JSON
from app.db.base import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), default="Marrakech, Morocco", nullable=False)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    highlights = Column(JSON, default=list, nullable=False)  # List of bullet points
    technologies = Column(JSON, default=list, nullable=False)  # List of tech tags
    order_index = Column(Integer, default=0, nullable=False)
