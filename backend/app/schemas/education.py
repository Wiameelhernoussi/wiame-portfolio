from typing import Optional
from pydantic import BaseModel, ConfigDict


class EducationBase(BaseModel):
    degree: str
    institution: str
    location: str
    start_date: str
    end_date: str
    description: str = ""
    order_index: int = 0


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = None


class EducationResponse(EducationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
