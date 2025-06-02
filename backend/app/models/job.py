from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from enum import Enum

from app.database import Base

class JobStatus(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="pending")
    amount = Column(Float, nullable=False)
    
    # Foreign keys
    provider_id = Column(String, ForeignKey("providers.id"), nullable=False)
    customer_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    provider = relationship("Provider", back_populates="jobs")
    customer = relationship("User", back_populates="jobs")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Job {self.id} - {self.title}>" 