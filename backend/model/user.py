"""User model."""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, func
from sqlalchemy.orm import relationship
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(200), nullable=False)
    location = Column(String(200), default="")
    interests = Column(Text, default="")
    bio = Column(Text, default="")
    avatar_url = Column(String(500), default="")
    role = Column(String(20), default="volunteer")  # volunteer, ngo_admin, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    ngo = relationship("NGO", back_populates="owner", uselist=False)
    applications = relationship("Application", back_populates="user")
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    notifications = relationship("Notification", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    posts = relationship("Post", back_populates="user")
