from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.provider import ProviderCreate, ProviderUpdate, ProviderResponse
from app.schemas.job import JobResponse, JobStats
from app.services.provider_service import ProviderService
from app.services.job_service import JobService
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/provider", tags=["provider"])

@router.post("/", response_model=ProviderResponse)
def create_provider(
    provider: ProviderCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider_service = ProviderService(db)
    return provider_service.create_provider(provider)

@router.get("/profile", response_model=ProviderResponse)
def get_provider_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider_service = ProviderService(db)
    provider = provider_service.get_provider_by_user_id(current_user["id"])
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider profile not found"
        )
    return provider

@router.put("/profile", response_model=ProviderResponse)
def update_provider_profile(
    provider_update: ProviderUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider_service = ProviderService(db)
    provider = provider_service.get_provider_by_user_id(current_user["id"])
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider profile not found"
        )
    
    updated_provider = provider_service.update_provider(provider.id, provider_update)
    if not updated_provider:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update provider profile"
        )
    return updated_provider

@router.get("/dashboard/stats", response_model=JobStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider_service = ProviderService(db)
    provider = provider_service.get_provider_by_user_id(current_user["id"])
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider profile not found"
        )
    
    stats = provider_service.get_provider_stats(provider.id)
    if not stats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get provider stats"
        )
    return stats

@router.get("/jobs", response_model=List[JobResponse])
def get_provider_jobs(
    status: str = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider_service = ProviderService(db)
    provider = provider_service.get_provider_by_user_id(current_user["id"])
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider profile not found"
        )
    
    job_service = JobService(db)
    jobs = job_service.get_provider_jobs(provider.id, status)
    return jobs

@router.put("/jobs/{job_id}/status")
def update_job_status(
    job_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider_service = ProviderService(db)
    provider = provider_service.get_provider_by_user_id(current_user["id"])
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider profile not found"
        )
    
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    if not job or job.provider_id != provider.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    updated_job = job_service.update_job_status(job_id, status)
    if not updated_job:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update job status"
        )
    return {"message": "Job status updated successfully"}

@router.get("/earnings")
def get_earnings_overview(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider_service = ProviderService(db)
    provider = provider_service.get_provider_by_user_id(current_user["id"])
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider profile not found"
        )
    
    job_service = JobService(db)
    earnings = job_service.get_earnings_overview(provider.id, days)
    return earnings 