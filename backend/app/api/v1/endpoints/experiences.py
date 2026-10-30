from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin_user
from app.models.experience import Experience
from app.models.user import AdminUser
from app.schemas.experience import (
    ExperienceResponse,
    ExperienceCreate,
    ExperienceUpdate
)

router = APIRouter()


@router.get("", response_model=List[ExperienceResponse])
def get_public_experiences(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.order_index.asc(), Experience.id.asc()).all()


@router.post("/admin", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_experience(
    payload: ExperienceCreate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    if not data.get("order_index"):
        max_order = db.query(Experience.order_index).order_by(Experience.order_index.desc()).first()
        data["order_index"] = (max_order[0] + 1) if max_order else 1

    exp = Experience(**data)
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@router.put("/admin/{exp_id}", response_model=ExperienceResponse)
def update_experience(
    exp_id: int,
    payload: ExperienceUpdate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(exp, field, val)

    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/admin/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    exp_id: int,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience not found")

    db.delete(exp)
    db.commit()
    return None


@router.put("/admin/reorder/batch")
def reorder_experiences(
    items: List[Dict[str, int]],
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    for item in items:
        eid = item.get("id")
        order = item.get("order_index", 0)
        if eid:
            db.query(Experience).filter(Experience.id == eid).update({"order_index": order})

    db.commit()
    return {"message": "Experiences reordered successfully"}
