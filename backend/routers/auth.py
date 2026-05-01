from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

# Import your database connection and tables
from database import get_db
from models import User

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# --- SECURITY SETUP (Hashing & JWT) ---
SECRET_KEY = os.getenv("SECRET_KEY", "rootify-dev-secret-key-2024-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- PYDANTIC SCHEMAS (What React sends us) ---
class UserCreate(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# --- REAL DATABASE ROUTES ---

@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if the email already exists in MySQL
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="Email is already registered"
        )

    # 2. Hash the password securely
    hashed_pwd = get_password_hash(user.password)

    # 3. Create the new user in the database
    new_user = User(
        full_name=user.full_name,
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User successfully created!"}


@router.post("/login", response_model=Token)
async def login_user(user: UserLogin, db: Session = Depends(get_db)):
    # 1. Find the user in MySQL
    db_user = db.query(User).filter(User.email == user.email).first()
    
    # 2. Check if user exists AND password matches the hashed password
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # 3. Create the JWT Token for React to save in LocalStorage
    access_token = create_access_token(data={"sub": db_user.email, "id": db_user.id})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "email": db_user.email
        }
    }