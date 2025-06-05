from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routes import (
    auth,
    provider,
    job,
    booking,
    payment,
    analytics,
    review,
    earnings,
    notifications
)
from app.database import engine, Base
from app.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Connectify Nigeria API",
    description="API for Connectify Nigeria - Service Provider Platform",
    version="1.0.0"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=3600,
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure this based on your deployment environment
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(provider.router, prefix="/api/v1")
app.include_router(job.router, prefix="/api/v1")
app.include_router(booking.router, prefix="/api/v1")
app.include_router(payment.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(review.router, prefix="/api/v1")
app.include_router(earnings.router, prefix="/api/v1")
app.include_router(notifications.router, prefix="/api/v1")

# Add WebSocket CORS middleware
@app.middleware("http")
async def websocket_cors_middleware(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/api/v1/ws"):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.get("/")
async def root():
    return {
        "message": "Welcome to Connectify Nigeria API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response 