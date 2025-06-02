from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from datetime import datetime, timedelta
from typing import List, Dict
from ..models import User, Job, Review, Payment
from ..schemas.analytics import (
    AnalyticsResponse, WeeklyBooking, MonthlyRevenue,
    ServiceDistribution, RatingDistribution, RecentActivity,
    PaymentMethod
)

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    async def get_provider_analytics(self, provider_id: str) -> AnalyticsResponse:
        # Get total bookings and revenue
        total_bookings = self.db.query(func.count(Job.id)).filter(
            Job.provider_id == provider_id
        ).scalar()

        total_revenue = self.db.query(func.sum(Job.amount)).filter(
            Job.provider_id == provider_id,
            Job.status == "completed"
        ).scalar() or 0.0

        # Get average rating
        reviews = self.db.query(Review).filter(
            Review.provider_id == provider_id
        ).all()
        average_rating = sum(review.rating for review in reviews) / len(reviews) if reviews else 0.0

        # Calculate average response time (time between job creation and first provider response)
        response_times = []
        jobs = self.db.query(Job).filter(
            Job.provider_id == provider_id,
            Job.status != "pending"
        ).all()
        for job in jobs:
            if job.updated_at and job.created_at:
                response_time = (job.updated_at - job.created_at).total_seconds() / 3600  # Convert to hours
                response_times.append(response_time)
        average_response_time = sum(response_times) / len(response_times) if response_times else 0.0

        # Calculate trends
        now = datetime.utcnow()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        # Bookings trend
        current_week_bookings = self.db.query(func.count(Job.id)).filter(
            Job.provider_id == provider_id,
            Job.created_at >= week_ago
        ).scalar()
        previous_week_bookings = self.db.query(func.count(Job.id)).filter(
            Job.provider_id == provider_id,
            Job.created_at >= week_ago - timedelta(days=7),
            Job.created_at < week_ago
        ).scalar()
        bookings_trend = ((current_week_bookings - previous_week_bookings) / previous_week_bookings * 100) if previous_week_bookings else 0

        # Revenue trend
        current_month_revenue = self.db.query(func.sum(Job.amount)).filter(
            Job.provider_id == provider_id,
            Job.status == "completed",
            Job.completed_at >= month_ago
        ).scalar() or 0.0
        previous_month_revenue = self.db.query(func.sum(Job.amount)).filter(
            Job.provider_id == provider_id,
            Job.status == "completed",
            Job.completed_at >= month_ago - timedelta(days=30),
            Job.completed_at < month_ago
        ).scalar() or 0.0
        revenue_trend = ((current_month_revenue - previous_month_revenue) / previous_month_revenue * 100) if previous_month_revenue else 0

        # Rating trend
        current_month_avg = self.db.query(func.avg(Review.rating)).filter(
            Review.provider_id == provider_id,
            Review.created_at >= month_ago
        ).scalar() or 0.0
        previous_month_avg = self.db.query(func.avg(Review.rating)).filter(
            Review.provider_id == provider_id,
            Review.created_at >= month_ago - timedelta(days=30),
            Review.created_at < month_ago
        ).scalar() or 0.0
        rating_trend = current_month_avg - previous_month_avg

        # Response time trend
        current_week_avg = self.db.query(
            func.avg(extract('epoch', Job.updated_at - Job.created_at)) / 3600
        ).filter(
            Job.provider_id == provider_id,
            Job.status != "pending",
            Job.created_at >= week_ago
        ).scalar() or 0.0
        previous_week_avg = self.db.query(
            func.avg(extract('epoch', Job.updated_at - Job.created_at)) / 3600
        ).filter(
            Job.provider_id == provider_id,
            Job.status != "pending",
            Job.created_at >= week_ago - timedelta(days=7),
            Job.created_at < week_ago
        ).scalar() or 0.0
        response_time_trend = current_week_avg - previous_week_avg

        # Weekly bookings
        weekly_bookings = []
        for i in range(7):
            day = now - timedelta(days=i)
            count = self.db.query(func.count(Job.id)).filter(
                Job.provider_id == provider_id,
                func.date(Job.created_at) == day.date()
            ).scalar()
            weekly_bookings.append(WeeklyBooking(
                day=day.strftime("%a"),
                count=count
            ))
        weekly_bookings.reverse()

        # Monthly revenue
        monthly_revenue = []
        for i in range(6):
            month = now - timedelta(days=30*i)
            amount = self.db.query(func.sum(Job.amount)).filter(
                Job.provider_id == provider_id,
                Job.status == "completed",
                extract('month', Job.completed_at) == month.month,
                extract('year', Job.completed_at) == month.year
            ).scalar() or 0.0
            monthly_revenue.append(MonthlyRevenue(
                month=month.strftime("%b"),
                amount=amount
            ))
        monthly_revenue.reverse()

        # Service distribution
        service_counts = self.db.query(
            Job.service_type,
            func.count(Job.id)
        ).filter(
            Job.provider_id == provider_id
        ).group_by(Job.service_type).all()
        service_distribution = [
            ServiceDistribution(
                service_type=service_type,
                count=count
            ) for service_type, count in service_counts
        ]

        # Rating distribution
        rating_counts = self.db.query(
            Review.rating,
            func.count(Review.id)
        ).filter(
            Review.provider_id == provider_id
        ).group_by(Review.rating).all()
        rating_distribution = [
            RatingDistribution(
                rating=rating,
                count=count
            ) for rating, count in rating_counts
        ]

        # Recent activity
        recent_jobs = self.db.query(Job).filter(
            Job.provider_id == provider_id
        ).order_by(Job.created_at.desc()).limit(5).all()
        recent_reviews = self.db.query(Review).filter(
            Review.provider_id == provider_id
        ).order_by(Review.created_at.desc()).limit(5).all()
        
        recent_activity = []
        for job in recent_jobs:
            recent_activity.append(RecentActivity(
                type="booking",
                description=f"New booking from {job.customer.full_name}",
                timestamp=job.created_at
            ))
        for review in recent_reviews:
            recent_activity.append(RecentActivity(
                type="review",
                description=f"New {review.rating}-star review from {review.customer.full_name}",
                timestamp=review.created_at
            ))
        recent_activity.sort(key=lambda x: x.timestamp, reverse=True)
        recent_activity = recent_activity[:5]

        # Payment methods
        payment_counts = self.db.query(
            Payment.payment_method,
            func.count(Payment.id)
        ).filter(
            Payment.provider_id == provider_id
        ).group_by(Payment.payment_method).all()
        total_payments = sum(count for _, count in payment_counts)
        payment_methods = [
            PaymentMethod(
                method=method,
                percentage=(count / total_payments * 100) if total_payments else 0
            ) for method, count in payment_counts
        ]

        return AnalyticsResponse(
            total_bookings=total_bookings,
            total_revenue=total_revenue,
            average_rating=average_rating,
            average_response_time=average_response_time,
            bookings_trend=bookings_trend,
            revenue_trend=revenue_trend,
            rating_trend=rating_trend,
            response_time_trend=response_time_trend,
            weekly_bookings=weekly_bookings,
            monthly_revenue=monthly_revenue,
            service_distribution=service_distribution,
            rating_distribution=rating_distribution,
            recent_activity=recent_activity,
            payment_methods=payment_methods
        ) 