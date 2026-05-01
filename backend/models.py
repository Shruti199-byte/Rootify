from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)

    applications = relationship("Application", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    ngo = relationship("NGO", back_populates="owner", uselist=False)


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(150), index=True)
    description = Column(Text)
    location = Column(String(100))
    category = Column(String(50))
    contact_email = Column(String(150))
    contact_phone = Column(String(50), default="")
    website = Column(String(200), default="")
    contact_info = Column(String(150))
    is_verified = Column(Boolean, default=False)

    owner = relationship("User", back_populates="ngo")
    opportunities = relationship("Opportunity", back_populates="ngo")
    reviews = relationship("Review", back_populates="ngo")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id"))
    title = Column(String(150))
    description = Column(Text)
    time_commitment = Column(String(100))

    ngo = relationship("NGO", back_populates="opportunities")
    applications = relationship("Application", back_populates="opportunity")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    status = Column(String(50), default="pending")
    hours_contributed = Column(Integer, default=0)

    user = relationship("User", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer)
    receiver_id = Column(Integer)
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String(255))
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ngo_id = Column(Integer, ForeignKey("ngos.id"))
    rating = Column(Integer)
    content = Column(Text)

    user = relationship("User", back_populates="reviews")
    ngo = relationship("NGO", back_populates="reviews")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer)
    author_type = Column(String(50))
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class PostLike(Base):
    __tablename__ = "post_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))


class PostComment(Base):
    __tablename__ = "post_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())