from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.models import (
    AdminUser,
    Profile,
    Project,
    Experience,
    Education,
    Skill,
    Certificate,
    ContactMessage,
    SiteSetting,
    AnalyticsVisit,
    RateLimitEntry
)


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Database tables created successfully.")
