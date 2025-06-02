from fastapi import HTTPException, status
from typing import Any, Dict, Optional
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    message: str
    status: int
    errors: Optional[Dict[str, Any]] = None

class AppError(HTTPException):
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        errors: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            status_code=status_code,
            detail=ErrorResponse(
                message=message,
                status=status_code,
                errors=errors
            ).dict()
        )

class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND
        )

class ValidationError(AppError):
    def __init__(self, message: str = "Validation error", errors: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            errors=errors
        )

class AuthenticationError(AppError):
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED
        )

class AuthorizationError(AppError):
    def __init__(self, message: str = "Not authorized to perform this action"):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN
        )

class DatabaseError(AppError):
    def __init__(self, message: str = "Database operation failed"):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class ExternalServiceError(AppError):
    def __init__(self, message: str = "External service error"):
        super().__init__(
            message=message,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        ) 