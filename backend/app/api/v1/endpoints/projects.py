import re
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api.deps import get_db, get_current_admin_user
from app.models.project import Project
from app.models.user import AdminUser
from app.schemas.project import (
    ProjectResponse,
    ProjectDetailResponse,
    ProjectCreate,
    ProjectUpdate,
    ProjectNavigation
)

router = APIRouter()


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text or "project"


# Public Routes

@router.get("", response_model=List[ProjectResponse])
def get_public_projects(
    category: Optional[str] = Query(None, description="Filter by category"),
    technology: Optional[str] = Query(None, description="Filter by technology tag"),
    search: Optional[str] = Query(None, description="Search term for title or description"),
    featured: Optional[bool] = Query(None, description="Filter by featured status"),
    db: Session = Depends(get_db)
):
    """
    Public listing of published projects with multi-criteria filtering and search.
    """
    query = db.query(Project).filter(Project.is_published == True)

    if category and category.lower() != "all":
        query = query.filter(Project.category.ilike(f"%{category}%"))

    if featured is not None:
        query = query.filter(Project.is_featured == featured)

    projects = query.order_by(Project.order_index.asc(), Project.id.asc()).all()

    # In-memory filter for technology (since technologies is stored as JSON array)
    if technology and technology.lower() != "all":
        tech_lower = technology.lower()
        projects = [
            p for p in projects
            if any(tech_lower in str(t).lower() for t in (p.technologies or []))
        ]

    # Search filter
    if search:
        search_lower = search.lower()
        projects = [
            p for p in projects
            if search_lower in p.title.lower()
            or search_lower in p.short_description.lower()
            or search_lower in p.long_description.lower()
            or any(search_lower in str(t).lower() for t in (p.technologies or []))
        ]

    return projects


@router.get("/by-slug/{slug}", response_model=ProjectDetailResponse)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    """
    Retrieve project details by unique slug, including next/previous project navigation.
    """
    project = db.query(Project).filter(Project.slug == slug, Project.is_published == True).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with slug '{slug}' was not found"
        )

    # Calculate previous and next published projects
    published = (
        db.query(Project.id, Project.slug, Project.title)
        .filter(Project.is_published == True)
        .order_by(Project.order_index.asc(), Project.id.asc())
        .all()
    )

    prev_nav = None
    next_nav = None

    for i, p in enumerate(published):
        if p.id == project.id:
            if i > 0:
                prev_nav = published[i - 1]
            if i < len(published) - 1:
                next_nav = published[i + 1]
            break

    navigation = ProjectNavigation(
        prev_slug=prev_nav.slug if prev_nav else None,
        prev_title=prev_nav.title if prev_nav else None,
        next_slug=next_nav.slug if next_nav else None,
        next_title=next_nav.title if next_nav else None
    )

    detail_dict = {c.name: getattr(project, c.name) for c in project.__table__.columns}
    detail_dict["navigation"] = navigation
    return detail_dict


# Admin CRUD Routes

@router.get("/admin/all", response_model=List[ProjectResponse])
def get_all_projects_admin(
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin endpoint to view all projects, including unpublished drafts.
    """
    return db.query(Project).order_by(Project.order_index.asc(), Project.id.asc()).all()


@router.post("/admin", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Create a new project. Automatically generates unique slug if missing or duplicates exist.
    """
    data = payload.model_dump()
    slug = data.get("slug") or slugify(data["title"])

    # Ensure slug uniqueness
    base_slug = slug
    counter = 1
    while db.query(Project).filter(Project.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    data["slug"] = slug

    # If order_index not explicitly provided, place at the end
    if not data.get("order_index"):
        max_order = db.query(Project.order_index).order_by(Project.order_index.desc()).first()
        data["order_index"] = (max_order[0] + 1) if max_order else 1

    project = Project(**data)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/admin/{project_id}", response_model=ProjectResponse)
def get_project_by_id_admin(
    project_id: int,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.put("/admin/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = payload.model_dump(exclude_unset=True)

    # Check slug uniqueness if slug changed
    if "slug" in update_data and update_data["slug"] != project.slug:
        existing = db.query(Project).filter(Project.slug == update_data["slug"]).first()
        if existing and existing.id != project.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Slug '{update_data['slug']}' is already in use by another project"
            )

    for field, val in update_data.items():
        setattr(project, field, val)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/admin/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(project)
    db.commit()
    return None


@router.put("/admin/reorder/batch")
def reorder_projects(
    items: List[Dict[str, int]],
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Batch update order_index for projects drag-and-drop ordering.
    Expects payload: [{"id": 1, "order_index": 0}, {"id": 2, "order_index": 1}]
    """
    for item in items:
        proj_id = item.get("id")
        new_order = item.get("order_index", 0)
        if proj_id:
            db.query(Project).filter(Project.id == proj_id).update({"order_index": new_order})

    db.commit()
    return {"message": "Projects reordered successfully"}
