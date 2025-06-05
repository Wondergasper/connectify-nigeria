from sqlalchemy import Column, Float, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    provider_id = Column(String, ForeignKey("providers.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    job = relationship("Job", back_populates="reviews")
    provider = relationship("Provider", back_populates="reviews")
    customer = relationship("User", back_populates="reviews")

    def __repr__(self):
        return f"<Review {self.id} - Rating: {self.rating}>" 