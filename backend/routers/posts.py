from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Post, User, PostLike, PostComment
from services.auth import get_current_user

router = APIRouter(prefix="/api/posts", tags=["Posts"])


def serialize_post(post, db: Session, current_user_id=None):
    author = db.query(User).filter(User.id == post.author_id).first()

    likes_count = db.query(PostLike).filter(PostLike.post_id == post.id).count()

    liked_by_me = False
    if current_user_id:
        liked_by_me = (
            db.query(PostLike)
            .filter(PostLike.post_id == post.id, PostLike.user_id == current_user_id)
            .first()
            is not None
        )

    comments = (
        db.query(PostComment)
        .filter(PostComment.post_id == post.id)
        .order_by(PostComment.id.asc())
        .all()
    )

    return {
        "id": post.id,
        "content": post.content,
        "author_id": post.author_id,
        "author_name": author.full_name if author else "Unknown User",
        "author_type": post.author_type,
        "timestamp": post.timestamp,
        "likes_count": likes_count,
        "liked_by_me": liked_by_me,
        "comments": [
            {
                "id": c.id,
                "content": c.content,
                "user_id": c.user_id,
                "user_name": db.query(User).filter(User.id == c.user_id).first().full_name
                if db.query(User).filter(User.id == c.user_id).first()
                else "Unknown User",
                "timestamp": c.timestamp,
            }
            for c in comments
        ],
    }


@router.get("/")
def get_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    posts = db.query(Post).order_by(Post.id.desc()).all()
    return [serialize_post(p, db, current_user.id) for p in posts]


@router.post("/")
def create_post(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = data.get("content", "").strip()

    if not content:
        raise HTTPException(status_code=400, detail="Post content required")

    post = Post(
        author_id=current_user.id,
        author_type=getattr(current_user, "role", "user") or "user",
        content=content,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return serialize_post(post, db, current_user.id)


@router.post("/{post_id}/like")
def toggle_like(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = (
        db.query(PostLike)
        .filter(PostLike.post_id == post_id, PostLike.user_id == current_user.id)
        .first()
    )

    if existing:
        db.delete(existing)
    else:
        like = PostLike(post_id=post_id, user_id=current_user.id)
        db.add(like)

    db.commit()

    return serialize_post(post, db, current_user.id)


@router.post("/{post_id}/comments")
def add_comment(
    post_id: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    content = data.get("content", "").strip()

    if not content:
        raise HTTPException(status_code=400, detail="Comment required")

    comment = PostComment(
        post_id=post_id,
        user_id=current_user.id,
        content=content,
    )

    db.add(comment)
    db.commit()

    return serialize_post(post, db, current_user.id)