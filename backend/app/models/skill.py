from sqlalchemy import Column, Integer, String
from app.db.base import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)  # "AI & Machine Learning", "Data", "Engineering", "Languages & Databases"
    level = Column(Integer, default=85, nullable=False)  # Visual proficiency indicator (0-100)
    order_index = Column(Integer, default=0, nullable=False)
