from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    service_id = Column(String, ForeignKey("services.id"), nullable=False)
    provider_id = Column(String, ForeignKey("providers.id"), nullable=False)
    customer_id = Column(String, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    time = Column(String, nullable=False)  # Store as "HH:MM" format
    status = Column(String, nullable=False, default="pending")
    notes = Column(Text)
    
    # Relationships
    service = relationship("Service", back_populates="bookings")
    provider = relationship("Provider", back_populates="bookings")
    customer = relationship("User", foreign_keys=[customer_id], back_populates="customer_bookings")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Booking {self.id} - {self.date} {self.time}>" 