from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class JobStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"))
    customer_id = Column(Integer, ForeignKey("users.id"))
    service = Column(String(100), nullable=False)
    description = Column(String(500))
    location = Column(String(200))
    scheduled_date = Column(DateTime)
    scheduled_time = Column(String(10))  # Store as "HH:MM" format
    status = Column(Enum(JobStatus), default=JobStatus.PENDING)
    cost = Column(Float)
    notes = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    provider = relationship("Provider", back_populates="jobs")
    customer = relationship("User", back_populates="jobs")
    review = relationship("Review", back_populates="job", uselist=False)

    def __repr__(self):
        return f"<Job {self.id} - {self.service}>" 