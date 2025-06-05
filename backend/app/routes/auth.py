from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.auth.auth import create_access_token, get_current_active_user
from app.services.user_service import UserService
from app.config import settings

router = APIRouter(tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/auth/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    return user_service.create_user(user_data)

@router.post("/auth/token", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    user = user_service.authenticate_user(login_data.email, login_data.password)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(get_current_active_user)
):
    return current_user

@router.post("/auth/logout")
async def logout():
    return {"message": "Successfully logged out"}

@router.post("/auth/verify-email")
async def verify_email(
    token: str,
    db: Session = Depends(get_db)
):
    # TODO: Implement email verification logic
    pass

@router.post("/auth/forgot-password")
async def forgot_password(
    email: str,
    db: Session = Depends(get_db)
):
    # TODO: Implement forgot password logic
    pass

@router.post("/auth/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    # TODO: Implement password reset logic
    pass 