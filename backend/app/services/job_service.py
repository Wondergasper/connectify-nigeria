from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.job import Job, JobStatus
from app.schemas.job import JobCreate, JobUpdate
from datetime import datetime, timedelta

class JobService:
    def __init__(self, db: Session):
        self.db = db

    def create_job(self, job: JobCreate) -> Job:
        db_job = Job(
            provider_id=job.provider_id,
            customer_id=job.customer_id,
            service=job.service,
            description=job.description,
            location=job.location,
            scheduled_date=job.scheduled_date,
            scheduled_time=job.scheduled_time,
            cost=job.cost,
            notes=job.notes
        )
        self.db.add(db_job)
        self.db.commit()
        self.db.refresh(db_job)
        return db_job

    def get_job(self, job_id: int) -> Optional[Job]:
        return self.db.query(Job).filter(Job.id == job_id).first()

    def get_provider_jobs(self, provider_id: int, status: Optional[str] = None) -> List[Job]:
        query = self.db.query(Job).filter(Job.provider_id == provider_id)
        if status:
            query = query.filter(Job.status == status)
        return query.order_by(Job.created_at.desc()).all()

    def update_job_status(self, job_id: int, status: JobStatus) -> Optional[Job]:
        db_job = self.get_job(job_id)
        if not db_job:
            return None

        db_job.status = status
        self.db.commit()
        self.db.refresh(db_job)
        return db_job

    def update_job(self, job_id: int, job_update: JobUpdate) -> Optional[Job]:
        db_job = self.get_job(job_id)
        if not db_job:
            return None

        update_data = job_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_job, field, value)

        self.db.commit()
        self.db.refresh(db_job)
        return db_job

    def get_job_stats(self, provider_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> dict:
        query = self.db.query(Job).filter(Job.provider_id == provider_id)
        
        if start_date:
            query = query.filter(Job.scheduled_date >= start_date)
        if end_date:
            query = query.filter(Job.scheduled_date <= end_date)

        jobs = query.all()

        stats = {
            "total_jobs": len(jobs),
            "pending_jobs": len([j for j in jobs if j.status == JobStatus.PENDING]),
            "confirmed_jobs": len([j for j in jobs if j.status == JobStatus.CONFIRMED]),
            "completed_jobs": len([j for j in jobs if j.status == JobStatus.COMPLETED]),
            "cancelled_jobs": len([j for j in jobs if j.status == JobStatus.CANCELLED]),
            "total_earnings": sum(j.cost for j in jobs if j.status == JobStatus.COMPLETED)
        }

        return stats

    def get_earnings_overview(self, provider_id: int, days: int = 7) -> List[dict]:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        jobs = self.db.query(Job)\
            .filter(
                Job.provider_id == provider_id,
                Job.scheduled_date >= start_date,
                Job.scheduled_date <= end_date,
                Job.status == JobStatus.COMPLETED
            )\
            .all()

        # Create a dictionary to store earnings by date
        earnings_by_date = {}
        current_date = start_date
        while current_date <= end_date:
            earnings_by_date[current_date.strftime("%Y-%m-%d")] = 0
            current_date += timedelta(days=1)

        # Calculate earnings for each day
        for job in jobs:
            date_str = job.scheduled_date.strftime("%Y-%m-%d")
            earnings_by_date[date_str] += job.cost

        # Convert to list format
        earnings_list = [
            {"date": date, "amount": amount}
            for date, amount in earnings_by_date.items()
        ]

        return earnings_list 