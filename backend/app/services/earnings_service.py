from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Dict
from datetime import datetime, timedelta
from app.models.job import Job
from app.models.payment import Payment
from app.models.user import User
from ..schemas.earnings import EarningsStats, Transaction, MonthlyEarnings, ServiceEarnings

class EarningsService:
    def __init__(self, db: Session):
        self.db = db

    async def get_provider_earnings(self, provider_id: str, time_range: str) -> EarningsStats:
        # Calculate date range
        end_date = datetime.now()
        if time_range == "week":
            start_date = end_date - timedelta(days=7)
        elif time_range == "month":
            start_date = end_date - timedelta(days=30)
        else:  # year
            start_date = end_date - timedelta(days=365)

        # Get total earnings
        total_earnings = self.db.query(func.sum(Payment.amount))\
            .join(Job, Payment.job_id == Job.id)\
            .filter(
                Job.provider_id == provider_id,
                Payment.status == "completed"
            ).scalar() or 0.0

        # Get pending earnings
        pending_earnings = self.db.query(func.sum(Payment.amount))\
            .join(Job, Payment.job_id == Job.id)\
            .filter(
                Job.provider_id == provider_id,
                Payment.status == "pending"
            ).scalar() or 0.0

        # Get completed jobs count
        completed_jobs = self.db.query(func.count(Job.id))\
            .filter(
                Job.provider_id == provider_id,
                Job.status == "completed"
            ).scalar() or 0

        # Calculate average job value
        average_job_value = total_earnings / completed_jobs if completed_jobs > 0 else 0.0

        # Get earnings by month
        monthly_earnings = self.db.query(
            func.date_trunc('month', Payment.created_at).label('month'),
            func.sum(Payment.amount).label('amount')
        ).join(
            Job, Payment.job_id == Job.id
        ).filter(
            Job.provider_id == provider_id,
            Payment.status == "completed",
            Payment.created_at >= start_date
        ).group_by(
            func.date_trunc('month', Payment.created_at)
        ).order_by(
            func.date_trunc('month', Payment.created_at)
        ).all()

        earnings_by_month = [
            MonthlyEarnings(
                month=earnings.month.strftime("%B %Y"),
                amount=float(earnings.amount)
            ) for earnings in monthly_earnings
        ]

        # Get earnings by service type
        service_earnings = self.db.query(
            Job.service_type,
            func.sum(Payment.amount).label('amount')
        ).join(
            Payment, Job.id == Payment.job_id
        ).filter(
            Job.provider_id == provider_id,
            Payment.status == "completed",
            Payment.created_at >= start_date
        ).group_by(
            Job.service_type
        ).all()

        earnings_by_service = [
            ServiceEarnings(
                service_type=earnings.service_type,
                amount=float(earnings.amount)
            ) for earnings in service_earnings
        ]

        # Get recent transactions
        recent_transactions = self.db.query(
            Payment,
            User.full_name.label('customer_name'),
            Job.service_type
        ).join(
            Job, Payment.job_id == Job.id
        ).join(
            User, Job.customer_id == User.id
        ).filter(
            Job.provider_id == provider_id
        ).order_by(
            Payment.created_at.desc()
        ).limit(10).all()

        transactions = []
        for payment, customer_name, service_type in recent_transactions:
            transactions.append(Transaction(
                id=str(payment.id),
                job_id=str(payment.job_id),
                customer_name=customer_name,
                service_type=service_type,
                amount=float(payment.amount),
                status=payment.status,
                date=payment.created_at
            ))

        return EarningsStats(
            total_earnings=float(total_earnings),
            pending_earnings=float(pending_earnings),
            completed_jobs=completed_jobs,
            average_job_value=average_job_value,
            earnings_by_month=earnings_by_month,
            earnings_by_service=earnings_by_service,
            recent_transactions=transactions
        ) 