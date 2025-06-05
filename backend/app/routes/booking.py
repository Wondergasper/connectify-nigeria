from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdate
from app.auth.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new booking"""
    db_booking = Booking(
        service_id=booking.service_id,
        provider_id=booking.provider_id,
        customer_id=current_user.id,
        date=booking.date,
        time=booking.time,
        status="pending",
        notes=booking.notes
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/", response_model=List[BookingResponse])
async def get_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all bookings for the current user"""
    if current_user.role == "provider":
        bookings = db.query(Booking).filter(Booking.provider_id == current_user.id).all()
    else:
        bookings = db.query(Booking).filter(Booking.customer_id == current_user.id).all()
    return bookings

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific booking by ID"""
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        (Booking.customer_id == current_user.id) | (Booking.provider_id == current_user.id)
    ).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    return booking

@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a booking"""
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        (Booking.customer_id == current_user.id) | (Booking.provider_id == current_user.id)
    ).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    for field, value in booking_update.dict(exclude_unset=True).items():
        setattr(booking, field, value)
    
    booking.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(booking)
    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a booking"""
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        (Booking.customer_id == current_user.id) | (Booking.provider_id == current_user.id)
    ).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    db.delete(booking)
    db.commit()
    return None 