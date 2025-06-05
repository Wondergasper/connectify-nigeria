from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.provider import router as provider_router
from app.routes.job import router as job_router
from app.routes.review import router as review_router
from app.routes.payment import router as payment_router
from app.routes.booking import router as booking_router

__all__ = [
    "auth_router",
    "user_router",
    "provider_router",
    "job_router",
    "review_router",
    "payment_router",
    "booking_router"
] 