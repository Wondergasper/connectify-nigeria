from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate
from app.models.provider import Provider

class ReviewService:
    def __init__(self, db: Session):
        self.db = db

    def create_review(self, review: ReviewCreate) -> Review:
        db_review = Review(
            job_id=review.job_id,
            provider_id=review.provider_id,
            customer_id=review.customer_id,
            rating=review.rating,
            comment=review.comment
        )
        self.db.add(db_review)
        self.db.commit()
        self.db.refresh(db_review)
        
        # Update provider's average rating
        self._update_provider_rating(review.provider_id)
        
        return db_review

    def get_review(self, review_id: int) -> Optional[Review]:
        return self.db.query(Review).filter(Review.id == review_id).first()

    def update_review(self, review_id: int, review_update: ReviewUpdate) -> Optional[Review]:
        db_review = self.get_review(review_id)
        if not db_review:
            return None

        update_data = review_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_review, field, value)

        self.db.commit()
        self.db.refresh(db_review)
        
        # Update provider's average rating
        self._update_provider_rating(db_review.provider_id)
        
        return db_review

    def delete_review(self, review_id: int) -> bool:
        db_review = self.get_review(review_id)
        if not db_review:
            return False

        provider_id = db_review.provider_id
        self.db.delete(db_review)
        self.db.commit()
        
        # Update provider's average rating
        self._update_provider_rating(provider_id)
        
        return True

    def get_provider_reviews(self, provider_id: int) -> List[Review]:
        return self.db.query(Review)\
            .filter(Review.provider_id == provider_id)\
            .order_by(Review.created_at.desc())\
            .all()

    def _update_provider_rating(self, provider_id: int) -> None:
        provider = self.db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            return

        reviews = self.get_provider_reviews(provider_id)
        if not reviews:
            provider.rating = 0
            provider.total_reviews = 0
        else:
            provider.rating = sum(r.rating for r in reviews) / len(reviews)
            provider.total_reviews = len(reviews)

        self.db.commit() 