"""Message schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    receiver_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool
    created_at: datetime
    sender_name: Optional[str] = None

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    user_id: int
    username: str
    full_name: str
    avatar_url: str
    last_message: str
    last_message_time: datetime
    unread_count: int
