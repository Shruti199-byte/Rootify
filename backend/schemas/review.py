"""Review schemas."""
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    ngo_id: int
    rating: int
    comment: Optional[str] = ""

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    ngo_id: int
    rating: int
    comment: str
    created_at: datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True
