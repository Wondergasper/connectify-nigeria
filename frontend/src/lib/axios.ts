import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, ApiErrorType, ApiError } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      const cleanToken = token.trim();
      if (cleanToken) {
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post('/api/v1/auth/refresh', { refreshToken });
        const { access_token } = response.data;
        
        localStorage.setItem('token', access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        processQueue(null, access_token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const apiError: ApiError = {
      type: ApiErrorType.UNKNOWN_ERROR,
      message: 'An unexpected error occurred',
      status: error.response?.status
    };

    if (error.response) {
      switch (error.response.status) {
        case 400:
          apiError.type = ApiErrorType.VALIDATION_ERROR;
          apiError.message = (error.response.data as any)?.detail || 'Invalid request';
          break;
        case 403:
          apiError.type = ApiErrorType.AUTHORIZATION_ERROR;
          apiError.message = 'You do not have permission to perform this action';
          break;
        case 404:
          apiError.type = ApiErrorType.NOT_FOUND_ERROR;
          apiError.message = 'The requested resource was not found';
          break;
        case 500:
          apiError.type = ApiErrorType.SERVER_ERROR;
          apiError.message = 'Internal server error';
          break;
      }
      apiError.details = error.response.data;
    } else if (error.request) {
      apiError.type = ApiErrorType.NETWORK_ERROR;
      apiError.message = 'Network error - no response received';
    }

    return Promise.reject(apiError);
  }
);

export default api; 