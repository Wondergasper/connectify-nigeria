from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from datetime import datetime
from app.models.user import User
from app.models.job import Job
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewStats, RatingDistribution, ReviewResponse
from app.models.provider import Provider
from fastapi import HTTPException

class ReviewService:
    def __init__(self, db: Session):
        self.db = db

    def create_review(self, review_data: ReviewCreate, customer_id: str) -> Review:
        # Get the job to verify it exists and get provider_id
        job = self.db.query(Job).filter(Job.id == review_data.job_id).first()
        if not job:
            raise ValueError("Job not found")
        
        # Create new review
        review = Review(
            rating=review_data.rating,
            comment=review_data.comment,
            customer_id=customer_id,
            provider_id=job.provider_id,
            job_id=review_data.job_id
        )
        
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        
        # Update provider's average rating
        self._update_provider_rating(job.provider_id)
        
        return review

    def get_review(self, review_id: str) -> Optional[Review]:
        return self.db.query(Review).filter(Review.id == review_id).first()

    def update_review(self, review_id: str, review_data: ReviewUpdate) -> Optional[Review]:
        review = self.get_review(review_id)
        if not review:
            return None
            
        for field, value in review_data.dict(exclude_unset=True).items():
            setattr(review, field, value)
            
        review.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(review)
        
        # Update provider's average rating
        self._update_provider_rating(review.provider_id)
        
        return review

    def delete_review(self, review_id: str) -> bool:
        review = self.get_review(review_id)
        if not review:
            return False
            
        self.db.delete(review)
        self.db.commit()
        
        # Update provider's average rating
        self._update_provider_rating(review.provider_id)
        
        return True

    def get_provider_reviews(self, provider_id: str) -> List[Review]:
        return self.db.query(Review).filter(Review.provider_id == provider_id).all()

    def _update_provider_rating(self, provider_id: int) -> None:
        provider = self.db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            return

        reviews = self.get_provider_reviews(str(provider_id))
        if not reviews:
            provider.rating = 0
            provider.total_reviews = 0
        else:
            provider.rating = sum(r.rating for r in reviews) / len(reviews)
            provider.total_reviews = len(reviews)

        self.db.commit()

    async def get_provider_reviews(self, provider_id: str) -> ReviewStats:
        # Get total reviews and average rating
        stats = self.db.query(
            func.count(Review.id).label('total_reviews'),
            func.avg(Review.rating).label('average_rating')
        ).filter(Review.provider_id == provider_id).first()
        
        # Get rating distribution
        distribution = self.db.query(
            Review.rating,
            func.count(Review.id).label('count')
        ).filter(
            Review.provider_id == provider_id
        ).group_by(Review.rating).all()
        
        # Get recent reviews
        recent_reviews = self.db.query(Review).filter(
            Review.provider_id == provider_id
        ).order_by(Review.created_at.desc()).limit(5).all()
        
        return ReviewStats(
            total_reviews=stats.total_reviews or 0,
            average_rating=float(stats.average_rating or 0),
            rating_distribution=[
                RatingDistribution(rating=r.rating, count=r.count)
                for r in distribution
            ],
            recent_reviews=recent_reviews
        )

    async def respond_to_review(self, review_id: str, provider_id: str, response: str) -> ReviewResponse:
        review = self.db.query(Review).filter(
            Review.id == review_id,
            Review.provider_id == provider_id
        ).first()

        if not review:
            raise HTTPException(
                status_code=404,
                detail="Review not found"
            )

        if review.provider_response:
            raise HTTPException(
                status_code=400,
                detail="Review already has a response"
            )

        review.provider_response = response
        self.db.commit()
        self.db.refresh(review)

        # Get customer and job details
        customer = self.db.query(User).filter(User.id == review.customer_id).first()
        job = self.db.query(Job).filter(Job.id == review.job_id).first()

        return ReviewResponse(
            id=str(review.id),
            customer_id=str(review.customer_id),
            customer_name=customer.full_name,
            provider_id=str(review.provider_id),
            job_id=str(review.job_id),
            job_service_type=job.service_type,
            rating=review.rating,
            comment=review.comment,
            provider_response=review.provider_response,
            created_at=review.created_at,
            updated_at=review.updated_at
        ) 