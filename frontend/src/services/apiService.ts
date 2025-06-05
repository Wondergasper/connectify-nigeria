import axios from 'axios';
import apiContract from '../config/api-contract.json';

class ApiService {
  private baseUrl: string;
  private axiosInstance;

  constructor() {
    this.baseUrl = apiContract.baseUrl;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
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

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Dashboard
  async getDashboardStats() {
    return this.axiosInstance.get(apiContract.endpoints.provider.dashboard.path);
  }

  // Jobs
  async getJobs(params: { status?: string; page?: number; limit?: number } = {}) {
    return this.axiosInstance.get(apiContract.endpoints.provider.jobs.list.path, { params });
  }

  async updateJobStatus(jobId: string, status: string) {
    return this.axiosInstance.patch(
      apiContract.endpoints.provider.jobs.updateStatus.path.replace('{jobId}', jobId),
      { status }
    );
  }

  // Profile
  async getProfile() {
    return this.axiosInstance.get(apiContract.endpoints.provider.profile.get.path);
  }

  async updateProfile(profileData: any) {
    return this.axiosInstance.put(
      apiContract.endpoints.provider.profile.update.path,
      profileData
    );
  }

  // Analytics
  async getAnalytics(params: { period?: string; startDate?: string; endDate?: string } = {}) {
    return this.axiosInstance.get(apiContract.endpoints.provider.analytics.get.path, { params });
  }

  // Reviews
  async getReviews(params: { page?: number; limit?: number } = {}) {
    return this.axiosInstance.get(apiContract.endpoints.provider.reviews.list.path, { params });
  }

  async respondToReview(reviewId: string, response: string) {
    return this.axiosInstance.post(
      apiContract.endpoints.provider.reviews.respond.path.replace('{reviewId}', reviewId),
      { response }
    );
  }

  // Earnings
  async getEarnings(params: { period?: string; startDate?: string; endDate?: string } = {}) {
    return this.axiosInstance.get(apiContract.endpoints.provider.earnings.get.path, { params });
  }

  async requestWithdrawal(amount: number) {
    return this.axiosInstance.post(
      apiContract.endpoints.provider.earnings.requestWithdrawal.path,
      { amount }
    );
  }

  async getTransactionHistory(params: { page?: number; limit?: number } = {}) {
    return this.axiosInstance.get(
      apiContract.endpoints.provider.earnings.transactions.path,
      { params }
    );
  }

  async getNotifications() {
    return this.axiosInstance.get('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.axiosInstance.post(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.axiosInstance.post('/notifications/read-all');
  }
}

export const apiService = new ApiService(); 