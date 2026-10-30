from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ExperienceBase(BaseModel):
    role: str
    company: str
    location: str = "Marrakech, Morocco"
    start_date: str
    end_date: str
    description: str
    highlights: List[str] = []
    technologies: List[str] = []
    order_index: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    highlights: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    order_index: Optional[int] = None


class ExperienceResponse(ExperienceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
