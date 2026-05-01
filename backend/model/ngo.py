"""NGO model."""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float, func
from sqlalchemy.orm import relationship
from backend.database import Base


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(300), nullable=False, index=True)
    description = Column(Text, nullable=False)
    location = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50), default="")
    website = Column(String(500), default="")
    logo_url = Column(String(500), default="")
    is_verified = Column(Boolean, default=False)
    average_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="ngo")
    opportunities = relationship("Opportunity", back_populates="ngo", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="ngo", cascade="all, delete-orphan")
