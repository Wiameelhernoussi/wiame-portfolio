from typing import Optional
from pydantic import BaseModel, ConfigDict


class CertificateBase(BaseModel):
    title: str
    issuer: str = "Coursera"
    issue_date: str = ""
    image_url: str = ""
    pdf_url: str = ""
    verification_url: str = ""
    order_index: int = 0
    is_visible: bool = False


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[str] = None
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    verification_url: Optional[str] = None
    order_index: Optional[int] = None
    is_visible: Optional[bool] = None


class CertificateResponse(CertificateBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
