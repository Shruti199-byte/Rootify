"""Notification schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NotificationCreate(BaseModel):
    user_id: int
    type: str
    title: str
    content: Optional[str] = ""
    link: Optional[str] = ""


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    content: str
    is_read: bool
    link: str
    created_at: datetime

    class Config:
        from_attributes = True
