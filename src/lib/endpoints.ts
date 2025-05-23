export const endpoints = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    verifyEmail: '/api/auth/verify-email'
  },
  users: {
    profile: (id: string) => `/api/users/${id}`,
    updateProfile: (id: string) => `/api/users/${id}`,
    updateRole: (id: string) => `/api/users/${id}/role`,
    toggleNotifications: (id: string) => `/api/users/${id}/notifications`
  },
  providers: {
    list: '/api/providers',
    get: (id: string) => `/api/providers/${id}`,
    update: (id: string) => `/api/providers/${id}`,
    services: (id: string) => `/api/providers/${id}/services`,
    availability: (id: string) => `/api/providers/${id}/availability`,
    reviews: (id: string) => `/api/providers/${id}/reviews`
  },
  bookings: {
    list: '/api/bookings',
    create: '/api/bookings',
    get: (id: string) => `/api/bookings/${id}`,
    updateStatus: (id: string) => `/api/bookings/${id}/status`,
    cancel: (id: string) => `/api/bookings/${id}/cancel`
  },
  payments: {
    create: '/api/payments',
    get: (id: string) => `/api/payments/${id}`,
    verify: (id: string) => `/api/payments/${id}/verify`
  },
  services: {
    list: '/api/services',
    get: (id: string) => `/api/services/${id}`,
    categories: '/api/services/categories'
  },
  notifications: {
    list: '/api/notifications',
    markRead: (id: string) => `/api/notifications/${id}/read`,
    markAllRead: '/api/notifications/read-all'
  }
}; 