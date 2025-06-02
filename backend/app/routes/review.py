from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from app.models.user import User
from app.models.review import Review
from app.models.job import Job
from ..schemas.review import ReviewResponse, ReviewStats
from ..auth import get_current_user
from ..services.review_service import ReviewService

router = APIRouter(
    prefix="/api/providers",
    tags=["reviews"]
)

@router.get("/reviews", response_model=ReviewStats)
async def get_provider_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all reviews for the current provider
    """
    if not current_user.is_provider:
        raise HTTPException(
            status_code=403,
            detail="Only providers can access reviews"
        )
    
    review_service = ReviewService(db)
    return await review_service.get_provider_reviews(current_user.id)

@router.post("/reviews/{review_id}/respond")
async def respond_to_review(
    review_id: str,
    response: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Respond to a specific review
    """
    if not current_user.is_provider:
        raise HTTPException(
            status_code=403,
            detail="Only providers can respond to reviews"
        )
    
    review_service = ReviewService(db)
    return await review_service.respond_to_review(review_id, current_user.id, response) 