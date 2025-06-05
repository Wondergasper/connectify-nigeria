from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from jose import JWTError, jwt
import logging

from app.database import get_db
from app.models.user import User
from app.auth.auth import get_current_active_user
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.services.notification_service import NotificationService
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["notifications"])

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"WebSocket connected for user {user_id}")

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"WebSocket disconnected for user {user_id}")

    async def send_notification(self, user_id: int, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)
            logger.info(f"Notification sent to user {user_id}")

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(..., description="JWT token for authentication")
):
    logger.info(f"WebSocket connection attempt with token: {token[:20]}...")
    try:
        # Validate token
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                logger.error("Token validation failed: no user_id in payload")
                await websocket.close()
                return
            logger.info(f"Token validated for user {user_id}")
        except JWTError as e:
            logger.error(f"Token validation failed: {str(e)}")
            await websocket.close()
            return

        # Get user from database
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            logger.error(f"User not found or inactive: {user_id}")
            await websocket.close()
            return
        logger.info(f"User found and active: {user_id}")

        await manager.connect(websocket, user.id)
        try:
            while True:
                # Keep connection alive
                await websocket.receive_text()
        except WebSocketDisconnect:
            logger.info(f"WebSocket disconnected for user {user.id}")
            manager.disconnect(user.id)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        await websocket.close()

@router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    notification_service = NotificationService(db)
    return notification_service.get_user_notifications(current_user.id)

@router.post("/notifications/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    notification_service = NotificationService(db)
    return notification_service.mark_as_read(notification_id, current_user.id)

@router.post("/notifications/read-all")
async def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    notification_service = NotificationService(db)
    return notification_service.mark_all_as_read(current_user.id) 