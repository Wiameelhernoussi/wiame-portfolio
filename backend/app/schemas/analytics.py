from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class VisitRecord(BaseModel):
    path: str = "/"
    referrer: Optional[str] = ""


class AnalyticsSummary(BaseModel):
    total_visits: int
    unique_visitors_today: int
    recent_visits: List[Dict[str, Any]] = []
    top_paths: List[Dict[str, Any]] = []


class AdminDashboardSummary(BaseModel):
    projects_count: int
    certificates_count: int
    unread_messages_count: int
    total_visits: int
    visits_today: int
