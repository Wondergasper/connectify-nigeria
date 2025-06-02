export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/token',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  USER_PROFILE: '/users/me',
  UPDATE_PROFILE: '/users/me',
  
  // Provider
  PROVIDER_PROFILE: '/providers/profile',
  PROVIDER_JOBS: '/providers/jobs',
  PROVIDER_EARNINGS: '/providers/earnings',
  PROVIDER_ANALYTICS: '/providers/analytics',
  PROVIDER_REVIEWS: '/providers/reviews',
  
  // Jobs
  JOBS: '/jobs',
  JOB_DETAILS: (id: string) => `/jobs/${id}`,
  CREATE_JOB: '/jobs',
  UPDATE_JOB: (id: string) => `/jobs/${id}`,
  
  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_DETAILS: (id: string) => `/bookings/${id}`,
  CREATE_BOOKING: '/bookings',
  
  // Payments
  PAYMENTS: '/payments',
  PAYMENT_DETAILS: (id: string) => `/payments/${id}`,
  CREATE_PAYMENT: '/payments',
  
  // Reviews
  REVIEWS: '/reviews',
  REVIEW_DETAILS: (id: string) => `/reviews/${id}`,
  CREATE_REVIEW: '/reviews',
};
