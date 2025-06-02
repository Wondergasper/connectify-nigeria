from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobStats
from app.services.job_service import JobService
from app.utils.auth import get_current_active_user
from typing import List

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.post("", response_model=JobResponse)
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    return job_service.create_job(job_data, current_user.id)

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    
    # Check if user has permission to view this job
    if current_user.role == "provider" and job.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this job"
        )
    elif current_user.role == "customer" and job.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this job"
        )
    
    return job

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    job_data: JobUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    
    # Check if user has permission to update this job
    if current_user.role == "provider" and job.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this job"
        )
    elif current_user.role == "customer" and job.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this job"
        )
    
    return job_service.update_job(job_id, job_data)

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    
    # Check if user has permission to delete this job
    if current_user.role == "provider" and job.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this job"
        )
    elif current_user.role == "customer" and job.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this job"
        )
    
    job_service.delete_job(job_id)

@router.get("/provider/me", response_model=List[JobResponse])
async def get_my_provider_jobs(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only providers can access their jobs"
        )
    
    job_service = JobService(db)
    return job_service.get_provider_jobs(current_user.id)

@router.get("/customer/me", response_model=List[JobResponse])
async def get_my_customer_jobs(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can access their jobs"
        )
    
    job_service = JobService(db)
    return job_service.get_customer_jobs(current_user.id)

@router.patch("/{job_id}/status", response_model=JobResponse)
async def update_job_status(
    job_id: str,
    status: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    
    # Check if user has permission to update job status
    if current_user.role == "provider" and job.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this job's status"
        )
    elif current_user.role == "customer" and job.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this job's status"
        )
    
    return job_service.update_job_status(job_id, status)

@router.get("/provider/dashboard/stats", response_model=JobStats)
async def get_provider_job_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only providers can access job statistics"
        )
    
    job_service = JobService(db)
    return job_service.get_provider_stats(current_user.id) 