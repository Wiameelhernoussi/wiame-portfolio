from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    title: str
    slug: Optional[str] = None
    category: str = "AI & Machine Learning"
    short_description: str
    long_description: str
    technologies: List[str] = []
    start_date: str
    end_date: str
    status: str = "Completed"
    is_featured: bool = False
    cover_image: str = ""
    gallery_images: List[Dict[str, Any]] = []
    metrics: List[Dict[str, Any]] = []
    links: Dict[str, str] = {}
    order_index: int = 0
    is_published: bool = True


class ProjectCreate(ProjectBase):
    title: str
    short_description: str
    long_description: str


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    technologies: Optional[List[str]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None
    cover_image: Optional[str] = None
    gallery_images: Optional[List[Dict[str, Any]]] = None
    metrics: Optional[List[Dict[str, Any]]] = None
    links: Optional[Dict[str, str]] = None
    order_index: Optional[int] = None
    is_published: Optional[bool] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectNavigation(BaseModel):
    prev_slug: Optional[str] = None
    prev_title: Optional[str] = None
    next_slug: Optional[str] = None
    next_title: Optional[str] = None


class ProjectDetailResponse(ProjectResponse):
    navigation: Optional[ProjectNavigation] = None
