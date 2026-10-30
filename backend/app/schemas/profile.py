from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class KeyFigureItem(BaseModel):
    label: str
    value: str
    sub: Optional[str] = ""


class LanguageItem(BaseModel):
    language: str
    level: str


class ProfileBase(BaseModel):
    full_name: str
    title: str
    pitch: str
    availability_badge: str
    about_bio: str
    location: str
    email: str = ""
    phone: str = ""
    github_url: str = ""
    linkedin_url: str = ""
    cv_url: str = ""
    avatar_url: str = ""
    key_figures: List[Dict[str, Any]] = []
    languages: List[Dict[str, Any]] = []
    interests: List[str] = []
    social_links: Dict[str, str] = {}


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    title: Optional[str] = None
    pitch: Optional[str] = None
    availability_badge: Optional[str] = None
    about_bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    cv_url: Optional[str] = None
    avatar_url: Optional[str] = None
    key_figures: Optional[List[Dict[str, Any]]] = None
    languages: Optional[List[Dict[str, Any]]] = None
    interests: Optional[List[str]] = None
    social_links: Optional[Dict[str, str]] = None


class ProfileResponse(ProfileBase):
    id: int
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
