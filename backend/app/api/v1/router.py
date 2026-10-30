from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    profile,
    projects,
    experiences,
    education,
    skills,
    certificates,
    messages,
    settings,
    analytics,
    uploads,
    seo
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(experiences.router, prefix="/experiences", tags=["Experience"])
api_router.include_router(education.router, prefix="/education", tags=["Education"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["Certificates"])
api_router.include_router(messages.router, prefix="/messages", tags=["Contact Messages"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & Dashboard"])
api_router.include_router(uploads.router, prefix="/admin/upload", tags=["Uploads"])
