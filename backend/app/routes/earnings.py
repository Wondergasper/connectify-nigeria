from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.payment import Payment
from ..schemas.earnings import EarningsStats
from ..auth import get_current_user
from ..services.earnings_service import EarningsService
from fastapi.responses import StreamingResponse
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/api/providers",
    tags=["earnings"]
)

@router.get("/earnings", response_model=EarningsStats)
async def get_provider_earnings(
    time_range: str = Query("month", description="Time range for earnings data (week/month/year)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get earnings statistics for the current provider
    """
    if not current_user.is_provider:
        raise HTTPException(
            status_code=403,
            detail="Only providers can access earnings data"
        )
    
    earnings_service = EarningsService(db)
    return await earnings_service.get_provider_earnings(current_user.id, time_range)

@router.get("/earnings/report")
async def download_earnings_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Download earnings report as PDF
    """
    if not current_user.is_provider:
        raise HTTPException(
            status_code=403,
            detail="Only providers can download earnings reports"
        )
    
    earnings_service = EarningsService(db)
    stats = await earnings_service.get_provider_earnings(current_user.id, "year")
    
    # Create PDF
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Add title
    p.setFont("Helvetica-Bold", 24)
    p.drawString(50, height - 50, "Earnings Report")
    
    # Add date
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 70, f"Generated on: {datetime.now().strftime('%Y-%m-%d')}")
    
    # Add provider info
    p.drawString(50, height - 90, f"Provider: {current_user.full_name}")
    
    # Add summary
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, height - 120, "Summary")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 140, f"Total Earnings: {stats.total_earnings:,.2f} NGN")
    p.drawString(50, height - 160, f"Pending Earnings: {stats.pending_earnings:,.2f} NGN")
    p.drawString(50, height - 180, f"Completed Jobs: {stats.completed_jobs}")
    p.drawString(50, height - 200, f"Average Job Value: {stats.average_job_value:,.2f} NGN")
    
    # Add recent transactions
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, height - 240, "Recent Transactions")
    p.setFont("Helvetica", 10)
    
    y = height - 260
    for transaction in stats.recent_transactions:
        if y < 50:  # Start new page if running out of space
            p.showPage()
            y = height - 50
        
        p.drawString(50, y, f"{transaction.customer_name} - {transaction.service_type}")
        p.drawString(50, y - 15, f"Amount: {transaction.amount:,.2f} NGN")
        p.drawString(50, y - 30, f"Date: {transaction.date}")
        p.drawString(50, y - 45, f"Status: {transaction.status}")
        y -= 70
    
    p.save()
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=earnings-report-{datetime.now().strftime('%Y-%m-%d')}.pdf"
        }
    ) 