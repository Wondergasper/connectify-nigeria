from sqlalchemy import Column, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    duration = Column(String, nullable=False)  # Store as "HH:MM" format
    provider_id = Column(String, ForeignKey("providers.id"), nullable=False)
    
    # Relationships
    provider = relationship("Provider", back_populates="services")
    bookings = relationship("Booking", back_populates="service")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Service {self.id} - {self.name}>" 