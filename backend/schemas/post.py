"""Post schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PostCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = ""
    post_type: Optional[str] = "general"


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    post_type: Optional[str] = None


class PostResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    image_url: str
    post_type: str
    created_at: datetime
    author_name: Optional[str] = None
    author_avatar: Optional[str] = None

    class Config:
        from_attributes = True
