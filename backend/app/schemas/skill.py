from typing import Optional
from pydantic import BaseModel, ConfigDict


class SkillBase(BaseModel):
    name: str
    category: str
    level: int = 85
    order_index: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[int] = None
    order_index: Optional[int] = None


class SkillResponse(SkillBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
