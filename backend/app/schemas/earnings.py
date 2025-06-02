from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Transaction(BaseModel):
    id: str
    job_id: str
    customer_name: str
    service_type: str
    amount: float
    status: str
    date: datetime

class MonthlyEarnings(BaseModel):
    month: str
    amount: float

class ServiceEarnings(BaseModel):
    service_type: str
    amount: float

class EarningsStats(BaseModel):
    total_earnings: float
    pending_earnings: float
    completed_jobs: int
    average_job_value: float
    earnings_by_month: List[MonthlyEarnings]
    earnings_by_service: List[ServiceEarnings]
    recent_transactions: List[Transaction] 