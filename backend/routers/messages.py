from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from jose import JWTError, jwt
import json

from database import get_db, SessionLocal
from models import Message, User
from config import SECRET_KEY, ALGORITHM
from services.auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["Messages"])


class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.setdefault(user_id, []).append(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)

    async def send_to_user(self, user_id: int, message: dict):
        if user_id in self.active_connections:
            for ws in self.active_connections[user_id]:
                await ws.send_text(json.dumps(message))


manager = ConnectionManager()


def serialize_message(msg: Message):
    return {
        "id": msg.id,
        "sender_id": msg.sender_id,
        "receiver_id": msg.receiver_id,
        "content": msg.content,
        "created_at": msg.timestamp.isoformat() if msg.timestamp else None,
    }


def get_user_from_token(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        return None

    return db.query(User).filter(User.id == user_id).first()


@router.get("/conversations")
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    messages = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id,
        )
    ).order_by(Message.timestamp.desc()).all()

    conversations = {}

    for msg in messages:
        other_id = msg.receiver_id if msg.sender_id == current_user.id else msg.sender_id

        if other_id not in conversations:
            other_user = db.query(User).filter(User.id == other_id).first()

            conversations[other_id] = {
                "user_id": other_id,
                "full_name": other_user.full_name if other_user else f"User #{other_id}",
                "email": other_user.email if other_user else "",
                "last_message": msg.content,
                "unread_count": 0,
            }

    return list(conversations.values())


@router.get("/{user_id}")
def get_chat_messages(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == user_id),
            and_(Message.sender_id == user_id, Message.receiver_id == current_user.id),
        )
    ).order_by(Message.timestamp.asc()).all()

    return [serialize_message(m) for m in messages]


@router.post("/")
def send_message_rest(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    receiver_id = data.get("receiver_id")
    content = data.get("content")

    if not receiver_id or not content:
        raise HTTPException(status_code=400, detail="receiver_id and content required")

    msg = Message(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=content,
    )

    db.add(msg)
    db.commit()
    db.refresh(msg)

    return serialize_message(msg)


@router.websocket("/ws/{token}")
async def websocket_chat(websocket: WebSocket, token: str):
    db = SessionLocal()
    user = get_user_from_token(token, db)

    if not user:
        await websocket.close(code=1008)
        db.close()
        return

    await manager.connect(user.id, websocket)

    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)

            receiver_id = int(data.get("receiver_id"))
            content = data.get("content", "").strip()

            if not content:
                continue

            msg = Message(
                sender_id=user.id,
                receiver_id=receiver_id,
                content=content,
            )

            db.add(msg)
            db.commit()
            db.refresh(msg)

            payload = serialize_message(msg)

            await manager.send_to_user(user.id, payload)
            await manager.send_to_user(receiver_id, payload)

    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)
    finally:
        db.close()