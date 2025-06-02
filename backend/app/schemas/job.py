from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum
from uuid import UUID

class JobStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class JobBase(BaseModel):
    service_type: str = Field(..., description="Type of service requested")
    scheduled_date: datetime = Field(..., description="Date when the service is scheduled")
    scheduled_time: str = Field(..., description="Time when the service is scheduled")
    location: str = Field(..., description="Location where the service will be provided")
    notes: Optional[str] = Field(None, description="Additional notes about the job")
    amount: float = Field(..., description="Amount to be paid for the service")

class JobCreate(JobBase):
    provider_id: UUID = Field(..., description="ID of the provider who will perform the service")

class JobUpdate(BaseModel):
    service_type: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    amount: Optional[float] = None

class JobResponse(JobBase):
    id: UUID
    customer_id: UUID
    provider_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class JobStats(BaseModel):
    total_jobs: int
    completed_jobs: int
    total_earnings: float
    jobs_by_status: Dict[str, int]
    recent_jobs: List[JobResponse]

    class Config:
        orm_mode = True 