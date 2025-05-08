
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-repl-url.replit.dev/api'
  : 'http://0.0.0.0:5000/api';

export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
  },
  users: {
    profile: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
  },
  bookings: {
    list: '/bookings',
    create: '/bookings',
    details: (id: string) => `/bookings/${id}`,
  },
  providers: {
    list: '/providers',
    details: (id: string) => `/providers/${id}`,
    reviews: (id: string) => `/providers/${id}/reviews`,
  },
};
