from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime, timedelta
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.review import Review
from app.models.payment import Payment
from app.auth.auth import get_current_active_user
from app.schemas.analytics import (
    DashboardStats,
    RevenueStats,
    JobStats,
    UserStats,
    TimeRange
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    time_range: TimeRange = TimeRange.MONTH,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access analytics"
        )
    
    # Calculate date range
    end_date = datetime.utcnow()
    if time_range == TimeRange.WEEK:
        start_date = end_date - timedelta(days=7)
    elif time_range == TimeRange.MONTH:
        start_date = end_date - timedelta(days=30)
    else:  # YEAR
        start_date = end_date - timedelta(days=365)
    
    # Get total users
    total_users = db.query(func.count(User.id)).scalar()
    new_users = db.query(func.count(User.id)).filter(
        User.created_at >= start_date
    ).scalar()
    
    # Get total jobs
    total_jobs = db.query(func.count(Job.id)).scalar()
    new_jobs = db.query(func.count(Job.id)).filter(
        Job.created_at >= start_date
    ).scalar()
    
    # Get total revenue
    total_revenue = db.query(func.sum(Payment.amount)).scalar() or 0
    period_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.created_at >= start_date
    ).scalar() or 0
    
    # Get average rating
    avg_rating = db.query(func.avg(Review.rating)).scalar() or 0
    
    return DashboardStats(
        total_users=total_users,
        new_users=new_users,
        total_jobs=total_jobs,
        new_jobs=new_jobs,
        total_revenue=total_revenue,
        period_revenue=period_revenue,
        average_rating=float(avg_rating)
    )

@router.get("/revenue", response_model=RevenueStats)
async def get_revenue_stats(
    time_range: TimeRange = TimeRange.MONTH,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access analytics"
        )
    
    # Calculate date range
    end_date = datetime.utcnow()
    if time_range == TimeRange.WEEK:
        start_date = end_date - timedelta(days=7)
    elif time_range == TimeRange.MONTH:
        start_date = end_date - timedelta(days=30)
    else:  # YEAR
        start_date = end_date - timedelta(days=365)
    
    # Get revenue by service type
    revenue_by_service = db.query(
        Job.service_type,
        func.sum(Payment.amount).label('total')
    ).join(
        Payment, Job.id == Payment.job_id
    ).filter(
        Payment.created_at >= start_date
    ).group_by(
        Job.service_type
    ).all()
    
    # Get revenue by date
    revenue_by_date = db.query(
        func.date(Payment.created_at).label('date'),
        func.sum(Payment.amount).label('total')
    ).filter(
        Payment.created_at >= start_date
    ).group_by(
        func.date(Payment.created_at)
    ).all()
    
    return RevenueStats(
        by_service_type={
            service: float(total)
            for service, total in revenue_by_service
        },
        by_date={
            date.strftime('%Y-%m-%d'): float(total)
            for date, total in revenue_by_date
        }
    )

@router.get("/jobs", response_model=JobStats)
async def get_job_stats(
    time_range: TimeRange = TimeRange.MONTH,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access analytics"
        )
    
    # Calculate date range
    end_date = datetime.utcnow()
    if time_range == TimeRange.WEEK:
        start_date = end_date - timedelta(days=7)
    elif time_range == TimeRange.MONTH:
        start_date = end_date - timedelta(days=30)
    else:  # YEAR
        start_date = end_date - timedelta(days=365)
    
    # Get jobs by service type
    jobs_by_service = db.query(
        Job.service_type,
        func.count(Job.id).label('count')
    ).filter(
        Job.created_at >= start_date
    ).group_by(
        Job.service_type
    ).all()
    
    # Get jobs by status
    jobs_by_status = db.query(
        Job.status,
        func.count(Job.id).label('count')
    ).filter(
        Job.created_at >= start_date
    ).group_by(
        Job.status
    ).all()
    
    return JobStats(
        by_service_type={
            service: count
            for service, count in jobs_by_service
        },
        by_status={
            status: count
            for status, count in jobs_by_status
        }
    )

@router.get("/users", response_model=UserStats)
async def get_user_stats(
    time_range: TimeRange = TimeRange.MONTH,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access analytics"
        )
    
    # Calculate date range
    end_date = datetime.utcnow()
    if time_range == TimeRange.WEEK:
        start_date = end_date - timedelta(days=7)
    elif time_range == TimeRange.MONTH:
        start_date = end_date - timedelta(days=30)
    else:  # YEAR
        start_date = end_date - timedelta(days=365)
    
    # Get users by role
    users_by_role = db.query(
        User.role,
        func.count(User.id).label('count')
    ).group_by(
        User.role
    ).all()
    
    # Get new users by date
    new_users_by_date = db.query(
        func.date(User.created_at).label('date'),
        func.count(User.id).label('count')
    ).filter(
        User.created_at >= start_date
    ).group_by(
        func.date(User.created_at)
    ).all()
    
    return UserStats(
        by_role={
            role: count
            for role, count in users_by_role
        },
        new_users_by_date={
            date.strftime('%Y-%m-%d'): count
            for date, count in new_users_by_date
        }
    ) 