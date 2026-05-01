"""Reviews router."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend.models.review import Review
from backend.models.ngo import NGO
from backend.models.user import User
from backend.schemas.review import ReviewCreate, ReviewResponse
from backend.services.auth import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewResponse, status_code=201)
def create_review(review_data: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == review_data.ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    existing = db.query(Review).filter(Review.user_id == current_user.id, Review.ngo_id == review_data.ngo_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already reviewed this NGO")
    review = Review(user_id=current_user.id, ngo_id=review_data.ngo_id, rating=review_data.rating, comment=review_data.comment or "")
    db.add(review)
    db.commit()
    # Update NGO average rating
    avg = db.query(func.avg(Review.rating)).filter(Review.ngo_id == ngo.id).scalar() or 0
    total = db.query(Review).filter(Review.ngo_id == ngo.id).count()
    ngo.average_rating = round(float(avg), 2)
    ngo.total_reviews = total
    db.commit()
    db.refresh(review)
    return ReviewResponse(id=review.id, user_id=review.user_id, ngo_id=review.ngo_id, rating=review.rating, comment=review.comment, created_at=review.created_at, user_name=current_user.full_name)


@router.get("/ngo/{ngo_id}", response_model=list[ReviewResponse])
def get_ngo_reviews(ngo_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.ngo_id == ngo_id).order_by(Review.created_at.desc()).all()
    result = []
    for r in reviews:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append(ReviewResponse(id=r.id, user_id=r.user_id, ngo_id=r.ngo_id, rating=r.rating, comment=r.comment, created_at=r.created_at, user_name=user.full_name if user else None))
    return result
