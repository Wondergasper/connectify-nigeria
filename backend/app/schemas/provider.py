from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class ProviderBase(BaseModel):
    business_name: str
    business_description: Optional[str] = None
    service_category: str
    years_of_experience: Optional[float] = None
    hourly_rate: Optional[float] = None
    availability: Optional[str] = None  # JSON string of availability schedule
    location: Optional[str] = None

class ProviderCreate(ProviderBase):
    pass

class ProviderUpdate(ProviderBase):
    business_name: Optional[str] = None
    service_category: Optional[str] = None

class ProviderResponse(ProviderBase):
    id: str
    user_id: str
    is_verified: bool
    rating: float
    total_reviews: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProviderProfile(ProviderResponse):
    user: dict  # Will contain user information
    jobs: List[dict]  # Will contain provider's jobs
    reviews: List[dict]  # Will contain provider's reviews 