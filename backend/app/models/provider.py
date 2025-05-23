from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20))
    location = Column(String(200))
    category = Column(String(50))
    bio = Column(String(500))
    base_rate = Column(Float)
    photo_url = Column(String(200))
    services = Column(JSON)  # List of services offered
    availability = Column(JSON)  # Weekly availability schedule
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    jobs = relationship("Job", back_populates="provider")
    reviews = relationship("Review", back_populates="provider")

    def __repr__(self):
        return f"<Provider {self.name}>" 