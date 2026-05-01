"""NGO schemas for request/response validation."""
from pydantic import BaseModel, EmailStr
from typing import Optional


class NGOBase(BaseModel):
    name: str
    description: str
    location: str
    category: str
    contact_email: EmailStr
    contact_phone: Optional[str] = ""
    website: Optional[str] = ""


class NGOCreate(NGOBase):
    pass


class NGOUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None


class NGOResponse(NGOBase):
    id: int
    owner_id: Optional[int] = None
    is_verified: bool = False

    average_rating: float = 0.0
    total_reviews: int = 0

    class Config:
        from_attributes = True


class NGOListResponse(BaseModel):
    items: list[NGOResponse]
    total: int
    page: int
    pages: int