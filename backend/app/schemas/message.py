from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: Optional[str] = Field("Portfolio Inquiry", max_length=150)
    message: str = Field(..., min_length=10, max_length=5000)
    honeypot: Optional[str] = Field("", description="Hidden anti-spam honeypot; must remain empty")


class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    subject: str
    message: str
    is_read: bool
    sender_ip: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
