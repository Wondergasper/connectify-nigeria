from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    rating: float = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=10, max_length=500)

class ReviewCreate(ReviewBase):
    job_id: int
    provider_id: int
    customer_id: int

class ReviewUpdate(BaseModel):
    rating: Optional[float] = Field(None, ge=1, le=5)
    comment: Optional[str] = Field(None, min_length=10, max_length=500)

class ReviewInDB(ReviewBase):
    id: int
    job_id: int
    provider_id: int
    customer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReviewResponse(ReviewInDB):
    pass 