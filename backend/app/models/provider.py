from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey, Text, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class Provider(Base):
    __tablename__ = "providers"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    business_name = Column(String, nullable=False)
    business_address = Column(String, nullable=False)
    business_phone = Column(String, nullable=False)
    business_email = Column(String, nullable=False)
    business_description = Column(Text, nullable=False)
    service_categories = Column(ARRAY(String), nullable=False)
    service_areas = Column(ARRAY(String), nullable=False)
    availability = Column(Text, nullable=False)  # JSON string of availability
    is_verified = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="provider")
    jobs = relationship("Job", back_populates="provider")
    reviews = relationship("Review", back_populates="provider")
    bookings = relationship("Booking", back_populates="provider")

    def __repr__(self):
        return f"<Provider {self.id} - {self.business_name}>" 