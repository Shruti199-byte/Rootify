"""NGO router: CRUD, search, filtering, verification."""
import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models import NGO, User
from schemas.ngo import NGOCreate, NGOUpdate, NGOResponse, NGOListResponse
from services.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/ngos", tags=["NGOs"])

VALID_CATEGORIES = [
    "education",
    "environment",
    "health",
    "poverty",
    "animals",
    "arts",
    "community",
    "disaster-relief",
    "human-rights",
    "technology",
    "youth",
    "elderly",
    "other",
]


def serialize_ngo(ngo: NGO):
    return {
        "id": ngo.id,
        "owner_id": ngo.owner_id,
        "name": ngo.name,
        "description": ngo.description,
        "location": ngo.location,
        "category": ngo.category,
        "contact_email": ngo.contact_email or "",
        "contact_phone": ngo.contact_phone or "",
        "website": ngo.website or "",
        "is_verified": bool(ngo.is_verified),
        "average_rating": 0.0,
        "total_reviews": 0,
    }


@router.post("/", response_model=NGOResponse, status_code=201)
def create_ngo(
    ngo_data: NGOCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(NGO).filter(NGO.owner_id == current_user.id).first()

    if existing:
        raise HTTPException(status_code=400, detail="You already have an NGO registered")

    ngo = NGO(
        owner_id=current_user.id,
        name=ngo_data.name,
        description=ngo_data.description,
        location=ngo_data.location,
        category=ngo_data.category,
        contact_email=ngo_data.contact_email,
        contact_phone=ngo_data.contact_phone or "",
        website=ngo_data.website or "",
        contact_info=ngo_data.contact_email,
        is_verified=False,
    )

    current_user.role = "ngo_admin"

    db.add(ngo)
    db.commit()
    db.refresh(ngo)

    return serialize_ngo(ngo)


@router.get("/", response_model=NGOListResponse)
def list_ngos(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    search: str = Query("", description="Search by name or description"),
    category: str = Query("", description="Filter by category"),
    location: str = Query("", description="Filter by location"),
    db: Session = Depends(get_db),
):
    query = db.query(NGO)

    if search:
        query = query.filter(
            or_(
                NGO.name.ilike(f"%{search}%"),
                NGO.description.ilike(f"%{search}%"),
            )
        )

    if category:
        query = query.filter(NGO.category == category)

    if location:
        query = query.filter(NGO.location.ilike(f"%{location}%"))

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 1

    items = (
        query.order_by(NGO.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "items": [serialize_ngo(ngo) for ngo in items],
        "total": total,
        "page": page,
        "pages": pages,
    }


@router.get("/categories")
def get_categories():
    return VALID_CATEGORIES


@router.get("/{ngo_id}", response_model=NGOResponse)
def get_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()

    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    return serialize_ngo(ngo)


@router.put("/{ngo_id}", response_model=NGOResponse)
def update_ngo(
    ngo_id: int,
    updates: NGOUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()

    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    if ngo.owner_id != current_user.id and getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = updates.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(ngo, field, value)

    db.commit()
    db.refresh(ngo)

    return serialize_ngo(ngo)


@router.delete("/{ngo_id}", status_code=204)
def delete_ngo(
    ngo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()

    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    if ngo.owner_id != current_user.id and getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(ngo)
    db.commit()


@router.post("/{ngo_id}/verify", response_model=NGOResponse)
def verify_ngo(
    ngo_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()

    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    ngo.is_verified = not ngo.is_verified

    db.commit()
    db.refresh(ngo)

    return serialize_ngo(ngo)