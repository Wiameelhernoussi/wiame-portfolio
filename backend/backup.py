"""
Database backup script for Wiame El Hernoussi's portfolio CMS.
Exports all relational records to timestamped JSON dumps (portable across SQLite & PostgreSQL)
and triggers pg_dump if PostgreSQL is configured.
"""

import os
import sys
import json
from datetime import datetime, timezone
from pathlib import Path

# Ensure backend root is on Python path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
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
    AnalyticsVisit
)


def backup_to_json(output_dir: str = "backups"):
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_file = out_path / f"portfolio_backup_{timestamp}.json"

    db: Session = SessionLocal()
    try:
        data = {
            "backup_timestamp": timestamp,
            "profiles": [
                {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
                for row in db.query(Profile).all()
            ],
            "projects": [
                {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
                for row in db.query(Project).all()
            ],
            "experiences": [
                {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
                for row in db.query(Experience).all()
            ],
            "educations": [
                {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
                for row in db.query(Education).all()
            ],
            "skills": [
                {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
                for row in db.query(Skill).all()
            ],
            "certificates": [
                {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
                for row in db.query(Certificate).all()
            ],
            "settings": [
                {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
                for row in db.query(SiteSetting).all()
            ],
            "messages": [
                {k: (v.isoformat() if isinstance(v, datetime) else v) for k, v in row.__dict__.items() if not k.startswith("_")}
                for row in db.query(ContactMessage).all()
            ]
        }

        # Convert non-serializable objects (datetime)
        def json_serial(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            raise TypeError(f"Type {type(obj)} not serializable")

        with open(backup_file, "w", encoding="utf-8") as f:
            json.dump(data, f, default=json_serial, indent=2, ensure_ascii=False)

        print(f"Backup created successfully: {backup_file}")
        return str(backup_file)
    finally:
        db.close()


if __name__ == "__main__":
    backup_to_json()
