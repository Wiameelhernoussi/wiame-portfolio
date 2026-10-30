from typing import Dict, Optional
from pydantic import BaseModel, ConfigDict


class SiteSettingBase(BaseModel):
    site_title: str
    meta_description: str
    keywords: str
    og_image_url: str = "/og-preview.png"
    accent_color: str = "#E9A21F"
    primary_color: str = "#2B3FA3"
    section_visibility: Dict[str, bool] = {
        "hero": True,
        "about": True,
        "projects": True,
        "experience": True,
        "skills": True,
        "certificates": True,
        "education": True,
        "interests": True,
        "contact": True
    }


class SiteSettingUpdate(BaseModel):
    site_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[str] = None
    og_image_url: Optional[str] = None
    accent_color: Optional[str] = None
    primary_color: Optional[str] = None
    section_visibility: Optional[Dict[str, bool]] = None


class SiteSettingResponse(SiteSettingBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
