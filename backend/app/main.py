from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    auth,
    provider,
    job,
    booking,
    payment,
    analytics,
    review,
    earnings
)
from app.database import engine, Base
from app.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Connectify Nigeria API",
    description="API for Connectify Nigeria - Service Provider Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(provider.router)
app.include_router(job.router)
app.include_router(booking.router)
app.include_router(payment.router)
app.include_router(analytics.router)
app.include_router(review.router)
app.include_router(earnings.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Connectify Nigeria API",
        "version": "1.0.0",
        "docs_url": "/docs"
    } 