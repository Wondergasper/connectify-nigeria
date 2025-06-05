from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate
from typing import List
from datetime import datetime

class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    def create_notification(self, notification: NotificationCreate) -> Notification:
        db_notification = Notification(
            user_id=notification.user_id,
            title=notification.title,
            message=notification.message,
            type=notification.type,
            data=notification.data
        )
        self.db.add(db_notification)
        self.db.commit()
        self.db.refresh(db_notification)
        return db_notification

    def get_user_notifications(self, user_id: str) -> List[Notification]:
        return self.db.query(Notification)\
            .filter(Notification.user_id == user_id)\
            .order_by(Notification.created_at.desc())\
            .all()

    def mark_as_read(self, notification_id: int, user_id: str) -> Notification:
        notification = self.db.query(Notification)\
            .filter(Notification.id == notification_id, Notification.user_id == user_id)\
            .first()
        
        if not notification:
            raise ValueError("Notification not found")
        
        notification.is_read = True
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def mark_all_as_read(self, user_id: str) -> int:
        result = self.db.query(Notification)\
            .filter(Notification.user_id == user_id, Notification.is_read == False)\
            .update({"is_read": True})
        
        self.db.commit()
        return result 