from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin_user
from app.models.skill import Skill
from app.models.user import AdminUser
from app.schemas.skill import (
    SkillResponse,
    SkillCreate,
    SkillUpdate
)

router = APIRouter()


@router.get("", response_model=List[SkillResponse])
def get_public_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.order_index.asc(), Skill.id.asc()).all()


@router.post("/admin", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    payload: SkillCreate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    if not data.get("order_index"):
        max_order = db.query(Skill.order_index).order_by(Skill.order_index.desc()).first()
        data["order_index"] = (max_order[0] + 1) if max_order else 1

    skill = Skill(**data)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.put("/admin/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    payload: SkillUpdate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(skill, field, val)

    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/admin/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

    db.delete(skill)
    db.commit()
    return None


@router.put("/admin/reorder/batch")
def reorder_skills(
    items: List[Dict[str, int]],
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    for item in items:
        sid = item.get("id")
        order = item.get("order_index", 0)
        if sid:
            db.query(Skill).filter(Skill.id == sid).update({"order_index": order})

    db.commit()
    return {"message": "Skills reordered successfully"}
