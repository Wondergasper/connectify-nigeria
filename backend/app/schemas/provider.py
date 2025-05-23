from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional, Dict
from datetime import datetime

class AvailabilitySchedule(BaseModel):
    day: str
    available: bool
    hours: Optional[str] = None

class ProviderBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    category: str
    bio: Optional[str] = None
    base_rate: float
    services: List[str]
    availability: List[AvailabilitySchedule]

class ProviderCreate(ProviderBase):
    user_id: int

class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    base_rate: Optional[float] = None
    services: Optional[List[str]] = None
    availability: Optional[List[AvailabilitySchedule]] = None
    photo_url: Optional[str] = None

class ProviderInDB(ProviderBase):
    id: int
    user_id: int
    photo_url: Optional[str]
    rating: float
    total_reviews: int
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProviderResponse(ProviderInDB):
    pass 