from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin_user
from app.models.certificate import Certificate
from app.models.user import AdminUser
from app.schemas.certificate import (
    CertificateResponse,
    CertificateCreate,
    CertificateUpdate
)

router = APIRouter()


@router.get("", response_model=List[CertificateResponse])
def get_public_certificates(db: Session = Depends(get_db)):
    """
    Public listing: returns only certificates marked as visible (is_visible=True).
    """
    return (
        db.query(Certificate)
        .filter(Certificate.is_visible == True)
        .order_by(Certificate.order_index.asc(), Certificate.id.asc())
        .all()
    )


@router.get("/admin/all", response_model=List[CertificateResponse])
def get_all_certificates_admin(
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin listing: returns all certificates including hidden placeholders.
    """
    return db.query(Certificate).order_by(Certificate.order_index.asc(), Certificate.id.asc()).all()


@router.post("/admin", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_certificate(
    payload: CertificateCreate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    if not data.get("order_index"):
        max_order = db.query(Certificate.order_index).order_by(Certificate.order_index.desc()).first()
        data["order_index"] = (max_order[0] + 1) if max_order else 1

    cert = Certificate(**data)
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.put("/admin/{cert_id}", response_model=CertificateResponse)
def update_certificate(
    cert_id: int,
    payload: CertificateUpdate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(cert, field, val)

    db.commit()
    db.refresh(cert)
    return cert


@router.delete("/admin/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificate(
    cert_id: int,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")

    db.delete(cert)
    db.commit()
    return None


@router.put("/admin/reorder/batch")
def reorder_certificates(
    items: List[Dict[str, int]],
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    for item in items:
        cid = item.get("id")
        order = item.get("order_index", 0)
        if cid:
            db.query(Certificate).filter(Certificate.id == cid).update({"order_index": order})

    db.commit()
    return {"message": "Certificates reordered successfully"}
