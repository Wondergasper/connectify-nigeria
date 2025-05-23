from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.provider import Provider
from app.schemas.provider import ProviderCreate, ProviderUpdate
from app.schemas.job import JobStats
from datetime import datetime, timedelta

class ProviderService:
    def __init__(self, db: Session):
        self.db = db

    def create_provider(self, provider: ProviderCreate) -> Provider:
        db_provider = Provider(
            user_id=provider.user_id,
            name=provider.name,
            email=provider.email,
            phone=provider.phone,
            location=provider.location,
            category=provider.category,
            bio=provider.bio,
            base_rate=provider.base_rate,
            services=provider.services,
            availability=provider.availability
        )
        self.db.add(db_provider)
        self.db.commit()
        self.db.refresh(db_provider)
        return db_provider

    def get_provider(self, provider_id: int) -> Optional[Provider]:
        return self.db.query(Provider).filter(Provider.id == provider_id).first()

    def get_provider_by_user_id(self, user_id: int) -> Optional[Provider]:
        return self.db.query(Provider).filter(Provider.user_id == user_id).first()

    def update_provider(self, provider_id: int, provider_update: ProviderUpdate) -> Optional[Provider]:
        db_provider = self.get_provider(provider_id)
        if not db_provider:
            return None

        update_data = provider_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_provider, field, value)

        self.db.commit()
        self.db.refresh(db_provider)
        return db_provider

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

    def update_availability(self, provider_id: int, availability: List[dict]) -> Optional[Provider]:
        provider = self.get_provider(provider_id)
        if not provider:
            return None

        provider.availability = availability
        self.db.commit()
        self.db.refresh(provider)
        return provider

    def update_services(self, provider_id: int, services: List[str]) -> Optional[Provider]:
        provider = self.get_provider(provider_id)
        if not provider:
            return None

        provider.services = services
        self.db.commit()
        self.db.refresh(provider)
        return provider 