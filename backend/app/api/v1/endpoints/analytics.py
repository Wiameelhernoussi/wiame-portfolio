import hashlib
from datetime import datetime, timezone, timedelta
from typing import Dict, Any
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_admin_user, get_client_ip
from app.core.config import settings
from app.models.analytics import AnalyticsVisit
from app.models.project import Project
from app.models.certificate import Certificate
from app.models.message import ContactMessage
from app.models.user import AdminUser
from app.schemas.analytics import VisitRecord, AdminDashboardSummary, AnalyticsSummary

router = APIRouter()


@router.post("/visit")
def record_visit(
    payload: VisitRecord,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Privacy-friendly visit tracking without third-party cookies.
    Hashes client IP with current date and secret salt to anonymize identity.
    """
    client_ip = get_client_ip(request)
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    salt = settings.SECRET_KEY[:16]
    ip_hash = hashlib.sha256(f"{client_ip}:{today_str}:{salt}".encode("utf-8")).hexdigest()

    user_agent = request.headers.get("User-Agent", "")[:250]
    visit = AnalyticsVisit(
        path=payload.path[:255] if payload.path else "/",
        referrer=(payload.referrer or "")[:255],
        ip_hash=ip_hash,
        user_agent=user_agent
    )
    db.add(visit)
    db.commit()
    return {"status": "recorded"}


@router.get("/admin/dashboard", response_model=AdminDashboardSummary)
def get_dashboard_summary(
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Summary stats for Admin Dashboard.
    """
    now = datetime.now(timezone.utc)
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)

    projects_count = db.query(Project).count()
    certificates_count = db.query(Certificate).count()
    unread_messages_count = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()
    total_visits = db.query(AnalyticsVisit).count()
    visits_today = db.query(AnalyticsVisit).filter(AnalyticsVisit.timestamp >= today_start).count()

    return AdminDashboardSummary(
        projects_count=projects_count,
        certificates_count=certificates_count,
        unread_messages_count=unread_messages_count,
        total_visits=total_visits,
        visits_today=visits_today
    )


@router.get("/admin/details", response_model=AnalyticsSummary)
def get_analytics_details(
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)

    total_visits = db.query(AnalyticsVisit).count()
    unique_visitors_today = (
        db.query(func.count(func.distinct(AnalyticsVisit.ip_hash)))
        .filter(AnalyticsVisit.timestamp >= today_start)
        .scalar() or 0
    )

    recent_rows = (
        db.query(AnalyticsVisit)
        .order_by(AnalyticsVisit.timestamp.desc())
        .limit(20)
        .all()
    )
    recent_visits = [
        {
            "id": r.id,
            "path": r.path,
            "referrer": r.referrer,
            "timestamp": r.timestamp.isoformat()
        }
        for r in recent_rows
    ]

    top_paths_rows = (
        db.query(AnalyticsVisit.path, func.count(AnalyticsVisit.id).label("count"))
        .group_by(AnalyticsVisit.path)
        .order_by(func.count(AnalyticsVisit.id).desc())
        .limit(10)
        .all()
    )
    top_paths = [{"path": row[0], "count": row[1]} for row in top_paths_rows]

    return AnalyticsSummary(
        total_visits=total_visits,
        unique_visitors_today=unique_visitors_today,
        recent_visits=recent_visits,
        top_paths=top_paths
    )
