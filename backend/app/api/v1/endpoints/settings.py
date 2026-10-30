from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin_user
from app.models.setting import SiteSetting
from app.models.user import AdminUser
from app.schemas.setting import SiteSettingResponse, SiteSettingUpdate

router = APIRouter()


@router.get("", response_model=SiteSettingResponse)
def get_public_settings(db: Session = Depends(get_db)):
    setting = db.query(SiteSetting).first()
    if not setting:
        setting = SiteSetting()
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting


@router.put("/admin", response_model=SiteSettingResponse)
def update_settings(
    payload: SiteSettingUpdate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    setting = db.query(SiteSetting).first()
    if not setting:
        setting = SiteSetting()
        db.add(setting)

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(setting, field, val)

    db.commit()
    db.refresh(setting)
    return setting
