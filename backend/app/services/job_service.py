from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.job import Job, JobStatus
from app.schemas.job import JobCreate, JobUpdate, JobStats
from datetime import datetime, timedelta
from sqlalchemy import func
from app.models.user import User
from fastapi import HTTPException, status

class JobService:
    def __init__(self, db: Session):
        self.db = db

    def create_job(self, job_data: JobCreate, customer_id: str) -> Job:
        # Verify provider exists and is active
        provider = self.db.query(User).filter(
            User.id == job_data.provider_id,
            User.role == "provider",
            User.is_active == True
        ).first()
        
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider not found or inactive"
            )
        
        # Create new job
        job = Job(
            customer_id=customer_id,
            provider_id=job_data.provider_id,
            service_type=job_data.service_type,
            scheduled_date=job_data.scheduled_date,
            scheduled_time=job_data.scheduled_time,
            location=job_data.location,
            notes=job_data.notes,
            amount=job_data.amount,
            status="pending"
        )
        
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job

    def get_job(self, job_id: str) -> Job:
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        return job

    def update_job(self, job_id: str, job_data: JobUpdate) -> Job:
        job = self.get_job(job_id)
        
        # Update job fields
        for field, value in job_data.dict(exclude_unset=True).items():
            setattr(job, field, value)
        
        self.db.commit()
        self.db.refresh(job)
        return job

    def delete_job(self, job_id: str) -> None:
        job = self.get_job(job_id)
        self.db.delete(job)
        self.db.commit()

    def get_provider_jobs(self, provider_id: str) -> List[Job]:
        return self.db.query(Job).filter(Job.provider_id == provider_id).all()

    def get_customer_jobs(self, customer_id: str) -> List[Job]:
        return self.db.query(Job).filter(Job.customer_id == customer_id).all()

    def update_job_status(self, job_id: str, status: str) -> Job:
        valid_statuses = ["pending", "accepted", "in_progress", "completed", "cancelled"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        job = self.get_job(job_id)
        job.status = status
        
        if status == "completed":
            job.completed_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(job)
        return job

    def get_provider_stats(self, provider_id: str) -> JobStats:
        # Get total jobs
        total_jobs = self.db.query(func.count(Job.id)).filter(
            Job.provider_id == provider_id
        ).scalar()
        
        # Get completed jobs
        completed_jobs = self.db.query(func.count(Job.id)).filter(
            Job.provider_id == provider_id,
            Job.status == "completed"
        ).scalar()
        
        # Get total earnings
        total_earnings = self.db.query(func.sum(Job.amount)).filter(
            Job.provider_id == provider_id,
            Job.status == "completed"
        ).scalar() or 0
        
        # Get jobs by status
        jobs_by_status = {}
        for status in ["pending", "accepted", "in_progress", "completed", "cancelled"]:
            count = self.db.query(func.count(Job.id)).filter(
                Job.provider_id == provider_id,
                Job.status == status
            ).scalar()
            jobs_by_status[status] = count
        
        # Get recent jobs (last 5)
        recent_jobs = self.db.query(Job).filter(
            Job.provider_id == provider_id
        ).order_by(Job.created_at.desc()).limit(5).all()
        
        return JobStats(
            total_jobs=total_jobs,
            completed_jobs=completed_jobs,
            total_earnings=total_earnings,
            jobs_by_status=jobs_by_status,
            recent_jobs=recent_jobs
        )

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