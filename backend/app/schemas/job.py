from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class JobStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class JobBase(BaseModel):
    service: str
    description: Optional[str] = None
    location: str
    scheduled_date: datetime
    scheduled_time: str
    cost: float
    notes: Optional[str] = None

class JobCreate(JobBase):
    provider_id: int
    customer_id: int

class JobUpdate(BaseModel):
    service: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: Optional[str] = None
    status: Optional[JobStatus] = None
    cost: Optional[float] = None
    notes: Optional[str] = None

class JobInDB(JobBase):
    id: int
    provider_id: int
    customer_id: int
    status: JobStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobResponse(JobInDB):
    pass

class JobStats(BaseModel):
    total_jobs: int
    pending_jobs: int
    confirmed_jobs: int
    completed_jobs: int
    cancelled_jobs: int
    total_earnings: float
    average_rating: float 