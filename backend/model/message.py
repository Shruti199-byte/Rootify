"""Message model for chat system."""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship
from backend.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])
