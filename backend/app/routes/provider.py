from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.provider import Provider
from app.models.job import Job
from app.models.user import User
from app.schemas.provider import ProviderResponse, ProviderUpdate
from app.schemas.job import JobResponse
from app.auth import get_current_user
from app.core.errors import NotFoundError, ValidationError, DatabaseError

router = APIRouter(prefix="/api/providers", tags=["providers"])

@router.get("/profile", response_model=ProviderResponse)
async def get_provider_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the current provider's profile"""
    try:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if not provider:
            raise NotFoundError("Provider profile not found")
        return provider
    except Exception as e:
        raise DatabaseError(f"Failed to fetch provider profile: {str(e)}")

@router.put("/profile", response_model=ProviderResponse)
async def update_provider_profile(
    provider_data: ProviderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current provider's profile"""
    try:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if not provider:
            raise NotFoundError("Provider profile not found")

        for field, value in provider_data.dict(exclude_unset=True).items():
            setattr(provider, field, value)
        
        db.commit()
        db.refresh(provider)
        return provider
    except ValidationError as e:
        raise e
    except Exception as e:
        raise DatabaseError(f"Failed to update provider profile: {str(e)}")

@router.get("/jobs", response_model=List[JobResponse])
async def get_provider_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all jobs for the current provider"""
    try:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if not provider:
            raise NotFoundError("Provider profile not found")
        
        jobs = db.query(Job).filter(Job.provider_id == provider.id).all()
        return jobs
    except Exception as e:
        raise DatabaseError(f"Failed to fetch provider jobs: {str(e)}")

@router.get("/earnings")
async def get_provider_earnings(
    time_range: str = "month",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get earnings for the current provider"""
    try:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if not provider:
            raise NotFoundError("Provider profile not found")
        
        # Calculate earnings based on time range
        # This is a simplified example - you'll need to implement the actual logic
        earnings = {
            "total_earnings": 0,
            "period_earnings": 0,
            "earnings_by_period": [],
            "recent_payments": []
        }
        return earnings
    except Exception as e:
        raise DatabaseError(f"Failed to fetch provider earnings: {str(e)}")

@router.get("/analytics")
async def get_provider_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics for the current provider"""
    try:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if not provider:
            raise NotFoundError("Provider profile not found")
        
        # Calculate analytics
        # This is a simplified example - you'll need to implement the actual logic
        analytics = {
            "total_jobs": 0,
            "completed_jobs": 0,
            "total_earnings": 0,
            "average_rating": 0,
            "jobs_by_category": [],
            "earnings_by_month": [],
            "customer_ratings": []
        }
        return analytics
    except Exception as e:
        raise DatabaseError(f"Failed to fetch provider analytics: {str(e)}")

@router.get("/reviews")
async def get_provider_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get reviews for the current provider"""
    try:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if not provider:
            raise NotFoundError("Provider profile not found")
        
        # Get reviews
        # This is a simplified example - you'll need to implement the actual logic
        reviews = {
            "average_rating": 0,
            "total_reviews": 0,
            "reviews": []
        }
        return reviews
    except Exception as e:
        raise DatabaseError(f"Failed to fetch provider reviews: {str(e)}") 