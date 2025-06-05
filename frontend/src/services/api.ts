import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import {
  AuthResponse,
  ProviderProfileResponse,
  JobStatsResponse,
  EarningsResponse,
  ReviewsResponse,
  AnalyticsResponse,
  Job,
  Payment,
  Review,
  User,
  ApiError,
  ApiResponse
} from '../types/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access forbidden:', error.response.data);
          break;
        case 404:
          console.error('Resource not found:', error.response.data);
          break;
        case 422:
          console.error('Validation error:', error.response.data);
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Auth
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    return response.data;
  },

  register: async (userData: Partial<User>): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  // User
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  // Provider
  getProviderProfile: async (): Promise<ApiResponse<ProviderProfileResponse>> => {
    const response = await api.get(API_ENDPOINTS.PROVIDER_PROFILE);
    return response.data;
  },

  getProviderJobs: async (): Promise<ApiResponse<Job[]>> => {
    const response = await api.get(API_ENDPOINTS.PROVIDER_JOBS);
    return response.data;
  },

  getProviderEarnings: async (timeRange: string): Promise<ApiResponse<EarningsResponse>> => {
    const response = await api.get(API_ENDPOINTS.PROVIDER_EARNINGS, {
      params: { time_range: timeRange }
    });
    return response.data;
  },

  getProviderAnalytics: async (): Promise<ApiResponse<AnalyticsResponse>> => {
    const response = await api.get(API_ENDPOINTS.PROVIDER_ANALYTICS);
    return response.data;
  },

  getProviderReviews: async (): Promise<ApiResponse<ReviewsResponse>> => {
    const response = await api.get(API_ENDPOINTS.PROVIDER_REVIEWS);
    return response.data;
  },

  // Jobs
  getJobs: async (): Promise<ApiResponse<Job[]>> => {
    const response = await api.get(API_ENDPOINTS.JOBS);
    return response.data;
  },

  getJobDetails: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await api.get(API_ENDPOINTS.JOB_DETAILS(id));
    return response.data;
  },

  createJob: async (jobData: Partial<Job>): Promise<ApiResponse<Job>> => {
    const response = await api.post(API_ENDPOINTS.CREATE_JOB, jobData);
    return response.data;
  },

  updateJob: async (id: string, jobData: Partial<Job>): Promise<ApiResponse<Job>> => {
    const response = await api.put(API_ENDPOINTS.UPDATE_JOB(id), jobData);
    return response.data;
  },

  // Payments
  getPayments: async (): Promise<ApiResponse<Payment[]>> => {
    const response = await api.get(API_ENDPOINTS.PAYMENTS);
    return response.data;
  },

  createPayment: async (paymentData: Partial<Payment>): Promise<ApiResponse<Payment>> => {
    const response = await api.post(API_ENDPOINTS.CREATE_PAYMENT, paymentData);
    return response.data;
  },

  // Reviews
  getReviews: async (): Promise<ApiResponse<Review[]>> => {
    const response = await api.get(API_ENDPOINTS.REVIEWS);
    return response.data;
  },

  createReview: async (reviewData: Partial<Review>): Promise<ApiResponse<Review>> => {
    const response = await api.post(API_ENDPOINTS.CREATE_REVIEW, reviewData);
    return response.data;
  },
};

export default apiService;
