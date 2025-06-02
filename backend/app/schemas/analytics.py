from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class WeeklyBooking(BaseModel):
    day: str
    count: int

class MonthlyRevenue(BaseModel):
    month: str
    amount: float

class ServiceDistribution(BaseModel):
    service_type: str
    count: int

class RatingDistribution(BaseModel):
    rating: int
    count: int

class RecentActivity(BaseModel):
    type: str
    description: str
    timestamp: datetime

class PaymentMethod(BaseModel):
    method: str
    percentage: float

class AnalyticsResponse(BaseModel):
    total_bookings: int
    total_revenue: float
    average_rating: float
    average_response_time: float
    bookings_trend: float
    revenue_trend: float
    rating_trend: float
    response_time_trend: float
    weekly_bookings: List[WeeklyBooking]
    monthly_revenue: List[MonthlyRevenue]
    service_distribution: List[ServiceDistribution]
    rating_distribution: List[RatingDistribution]
    recent_activity: List[RecentActivity]
    payment_methods: List[PaymentMethod]

class TimeRange(str, Enum):
    WEEK = "week"
    MONTH = "month"
    YEAR = "year"

class DashboardStats(BaseModel):
    total_users: int
    new_users: int
    total_jobs: int
    new_jobs: int
    total_revenue: float
    period_revenue: float
    average_rating: float

class RevenueStats(BaseModel):
    by_service_type: Dict[str, float]
    by_date: Dict[str, float]

class JobStats(BaseModel):
    by_service_type: Dict[str, int]
    by_status: Dict[str, int]

class UserStats(BaseModel):
    by_role: Dict[str, int]
    new_users_by_date: Dict[str, int] 