// Debug log to verify environment variables
console.log('API URL:', import.meta.env.VITE_API_URL);

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/v1/auth/token',
  REGISTER: '/api/v1/auth/register',
  REFRESH_TOKEN: '/api/v1/auth/refresh',
  VERIFY_EMAIL: '/api/v1/auth/verify-email',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  
  // User
  USER_PROFILE: '/api/v1/users/me',
  UPDATE_PROFILE: '/api/v1/users/me',
  
  // Provider
  PROVIDER_PROFILE: '/api/v1/providers/profile',
  PROVIDER_JOBS: '/api/v1/providers/jobs',
  PROVIDER_EARNINGS: '/api/v1/providers/earnings',
  PROVIDER_ANALYTICS: '/api/v1/providers/analytics',
  PROVIDER_REVIEWS: '/api/v1/providers/reviews',
  
  // Jobs
  JOBS: '/api/v1/jobs',
  JOB_DETAILS: (id: string) => `/api/v1/jobs/${id}`,
  CREATE_JOB: '/api/v1/jobs',
  UPDATE_JOB: (id: string) => `/api/v1/jobs/${id}`,
  
  // Bookings
  BOOKINGS: '/api/v1/bookings',
  BOOKING_DETAILS: (id: string) => `/api/v1/bookings/${id}`,
  CREATE_BOOKING: '/api/v1/bookings',
  
  // Payments
  PAYMENTS: '/api/v1/payments',
  PAYMENT_DETAILS: (id: string) => `/api/v1/payments/${id}`,
  CREATE_PAYMENT: '/api/v1/payments',
  
  // Reviews
  REVIEWS: '/api/v1/reviews',
  REVIEW_DETAILS: (id: string) => `/api/v1/reviews/${id}`,
  CREATE_REVIEW: '/api/v1/reviews',
};

// API Error Types
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  status?: number;
  details?: any;
}
