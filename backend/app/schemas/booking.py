from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookingBase(BaseModel):
    service_id: str
    provider_id: str
    date: datetime
    time: str
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    date: Optional[datetime] = None
    time: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class BookingResponse(BookingBase):
    id: str
    customer_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 