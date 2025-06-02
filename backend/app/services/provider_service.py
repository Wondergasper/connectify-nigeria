from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.provider import Provider
from app.schemas.provider import ProviderCreate, ProviderUpdate
from app.schemas.job import JobStats
from datetime import datetime, timedelta
from app.models.user import User
from fastapi import HTTPException, status
import json

class ProviderService:
    def __init__(self, db: Session):
        self.db = db

    def create_provider(self, provider_data: ProviderCreate, user_id: str) -> Provider:
        # Check if user already has a provider profile
        existing_provider = self.db.query(Provider).filter(Provider.user_id == user_id).first()
        if existing_provider:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has a provider profile"
            )

        # Create new provider
        provider = Provider(
            user_id=user_id,
            **provider_data.model_dump()
        )
        self.db.add(provider)
        self.db.commit()
        self.db.refresh(provider)
        return provider

    def get_provider(self, provider_id: str) -> Provider:
        provider = self.db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider not found"
            )
        return provider

    def get_provider_by_user_id(self, user_id: str) -> Provider:
        provider = self.db.query(Provider).filter(Provider.user_id == user_id).first()
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider profile not found"
            )
        return provider

    def update_provider(self, provider_id: str, provider_data: ProviderUpdate) -> Provider:
        provider = self.get_provider(provider_id)
        
        # Update provider fields
        for field, value in provider_data.model_dump(exclude_unset=True).items():
            setattr(provider, field, value)
        
        self.db.commit()
        self.db.refresh(provider)
        return provider

    def delete_provider(self, provider_id: str):
        provider = self.get_provider(provider_id)
        self.db.delete(provider)
        self.db.commit()

    def get_provider_profile(self, provider_id: str) -> dict:
        provider = self.get_provider(provider_id)
        
        # Get user information
        user = self.db.query(User).filter(User.id == provider.user_id).first()
        
        # Get provider's jobs
        jobs = provider.jobs
        
        # Get provider's reviews
        reviews = provider.reviews
        
        return {
            "provider": provider,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "jobs": [job.__dict__ for job in jobs],
            "reviews": [review.__dict__ for review in reviews]
        }

    def update_availability(self, provider_id: str, availability: str):
        provider = self.get_provider(provider_id)
        
        # Validate availability JSON
        try:
            json.loads(availability)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid availability format"
            )
        
        provider.availability = availability
        self.db.commit()
        self.db.refresh(provider)
        return provider

    def update_rating(self, provider_id: str, new_rating: float):
        provider = self.get_provider(provider_id)
        
        # Update rating and total reviews
        total_rating = provider.rating * provider.total_reviews
        provider.total_reviews += 1
        provider.rating = (total_rating + new_rating) / provider.total_reviews
        
        self.db.commit()
        self.db.refresh(provider)
        return provider

    def get_provider_stats(self, provider_id: int) -> JobStats:
        provider = self.get_provider(provider_id)
        if not provider:
            return None

        # Get all jobs for the provider
        jobs = provider.jobs

        # Calculate statistics
        total_jobs = len(jobs)
        pending_jobs = len([j for j in jobs if j.status == "pending"])
        confirmed_jobs = len([j for j in jobs if j.status == "confirmed"])
        completed_jobs = len([j for j in jobs if j.status == "completed"])
        cancelled_jobs = len([j for j in jobs if j.status == "cancelled"])
        
        # Calculate total earnings from completed jobs
        total_earnings = sum(j.cost for j in jobs if j.status == "completed")
        
        # Get average rating from reviews
        average_rating = provider.rating

        return JobStats(
            total_jobs=total_jobs,
            pending_jobs=pending_jobs,
            confirmed_jobs=confirmed_jobs,
            completed_jobs=completed_jobs,
            cancelled_jobs=cancelled_jobs,
            total_earnings=total_earnings,
            average_rating=average_rating
        )

    def get_recent_jobs(self, provider_id: int, limit: int = 5) -> List[dict]:
        provider = self.get_provider(provider_id)
        if not provider:
            return []

        recent_jobs = self.db.query(Provider.jobs)\
            .filter(Provider.id == provider_id)\
            .order_by(Provider.jobs.created_at.desc())\
            .limit(limit)\
            .all()

        return [
            {
                "id": job.id,
                "service": job.service,
                "customer_name": job.customer.name,
                "date": job.scheduled_date.strftime("%Y-%m-%d"),
                "time": job.scheduled_time,
                "status": job.status,
                "amount": f"₦{job.cost:,.2f}"
            }
            for job in recent_jobs
        ]

    def update_services(self, provider_id: int, services: List[str]) -> Optional[Provider]:
        provider = self.get_provider(provider_id)
        if not provider:
            return None

        provider.services = services
        self.db.commit()
        self.db.refresh(provider)
        return provider 