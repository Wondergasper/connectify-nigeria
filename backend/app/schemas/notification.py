from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str
    data: Optional[dict] = None

class NotificationCreate(NotificationBase):
    user_id: str

class NotificationResponse(NotificationBase):
    id: int
    user_id: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True 