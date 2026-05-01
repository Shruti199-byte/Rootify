"""Admin router: NGO verification, user management, stats."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.models.ngo import NGO
from backend.models.application import Application
from backend.schemas.user import UserResponse
from backend.schemas.ngo import NGOResponse
from backend.services.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/stats")
def get_stats(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count(),
        "total_ngos": db.query(NGO).count(),
        "verified_ngos": db.query(NGO).filter(NGO.is_verified == True).count(),
        "total_applications": db.query(Application).count(),
    }


@router.get("/users", response_model=list[UserResponse])
def list_users(page: int = Query(1, ge=1), limit: int = Query(20), current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(User).offset((page - 1) * limit).limit(limit).all()


@router.get("/ngos", response_model=list[NGOResponse])
def list_all_ngos(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(NGO).all()


@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, role: str = Query(...), current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    if role not in ["volunteer", "ngo_admin", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    return {"status": "ok", "role": role}
