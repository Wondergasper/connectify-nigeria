from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ReviewBase(BaseModel):
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    job_id: str

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None
    provider_response: Optional[str] = None

class ReviewResponse(ReviewBase):
    id: str
    customer_id: str
    customer_name: str
    provider_id: str
    job_id: str
    job_service_type: str
    provider_response: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RatingDistribution(BaseModel):
    rating: int
    count: int

class ReviewStats(BaseModel):
    total_reviews: int
    average_rating: float
    rating_distribution: List[RatingDistribution]
    recent_reviews: List[ReviewResponse] 