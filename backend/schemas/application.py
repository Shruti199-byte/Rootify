"""Application schemas."""
from pydantic import BaseModel
from typing import Optional


class ApplicationCreate(BaseModel):
    opportunity_id: int


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    hours_contributed: Optional[int] = None


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    status: str
    hours_contributed: int = 0

    user_name: Optional[str] = None
    user_email: Optional[str] = None
    opportunity_title: Optional[str] = None
    ngo_name: Optional[str] = None

    class Config:
        from_attributes = True