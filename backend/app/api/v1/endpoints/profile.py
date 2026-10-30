from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin_user
from app.models.profile import Profile
from app.models.user import AdminUser
from app.schemas.profile import ProfileResponse, ProfileUpdate

router = APIRouter()


@router.get("", response_model=ProfileResponse)
def get_public_profile(db: Session = Depends(get_db)):
    """
    Public profile endpoint. Returns biographical data, availability,
    key figures, languages, and social links.
    """
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile has not been initialized yet"
        )
    return profile


@router.put("/admin", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin-only endpoint to update profile biographical details, contact,
    avatar URL, CV link, and structured metadata.
    """
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile()
        db.add(profile)

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile
