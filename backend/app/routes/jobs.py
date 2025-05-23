from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.job import JobStatus
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobStats
from app.services.job_service import JobService
from app.utils.auth import get_current_active_user

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    job_service = JobService(db)
    return job_service.create_job(job)

@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_update: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if user has permission to update the job
    if current_user.user_type == "provider" and job.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this job"
        )
    
    updated_job = job_service.update_job(job_id, job_update)
    if not updated_job:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update job"
        )
    return updated_job

@router.put("/{job_id}/status")
def update_job_status(
    job_id: int,
    status: JobStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if user has permission to update the job status
    if current_user.user_type == "provider" and job.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this job"
        )
    
    updated_job = job_service.update_job_status(job_id, status)
    if not updated_job:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update job status"
        )
    return {"message": "Job status updated successfully"}

@router.get("/stats", response_model=JobStats)
def get_job_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    job_service = JobService(db)
    stats = job_service.get_job_stats(current_user.id)
    return stats 