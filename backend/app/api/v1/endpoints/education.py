from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin_user
from app.models.education import Education
from app.models.user import AdminUser
from app.schemas.education import (
    EducationResponse,
    EducationCreate,
    EducationUpdate
)

router = APIRouter()


@router.get("", response_model=List[EducationResponse])
def get_public_education(db: Session = Depends(get_db)):
    return db.query(Education).order_by(Education.order_index.asc(), Education.id.asc()).all()


@router.post("/admin", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
def create_education(
    payload: EducationCreate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    if not data.get("order_index"):
        max_order = db.query(Education.order_index).order_by(Education.order_index.desc()).first()
        data["order_index"] = (max_order[0] + 1) if max_order else 1

    edu = Education(**data)
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu


@router.put("/admin/{edu_id}", response_model=EducationResponse)
def update_education(
    edu_id: int,
    payload: EducationUpdate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education entry not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(edu, field, val)

    db.commit()
    db.refresh(edu)
    return edu


@router.delete("/admin/{edu_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(
    edu_id: int,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education entry not found")

    db.delete(edu)
    db.commit()
    return None


@router.put("/admin/reorder/batch")
def reorder_education(
    items: List[Dict[str, int]],
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    for item in items:
        eid = item.get("id")
        order = item.get("order_index", 0)
        if eid:
            db.query(Education).filter(Education.id == eid).update({"order_index": order})

    db.commit()
    return {"message": "Education entries reordered successfully"}
