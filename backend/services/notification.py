"""Notification service: create notifications for various events."""
from sqlalchemy.orm import Session
from backend.models.notification import Notification


def create_notification(
    db: Session,
    user_id: int,
    type: str,
    title: str,
    content: str = "",
    link: str = ""
):
    """Create a new notification for a user."""
    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        content=content,
        link=link
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
