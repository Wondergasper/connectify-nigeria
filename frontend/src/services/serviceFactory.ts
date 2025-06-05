import { mockService } from './mockService';
import { apiService } from './apiService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const service = USE_MOCK ? mockService : apiService;

// Type definitions for better TypeScript support
export interface Service {
  getDashboardStats: () => Promise<any>;
  getJobs: (params?: { status?: string; page?: number; limit?: number }) => Promise<any>;
  updateJobStatus: (jobId: string, status: string) => Promise<any>;
  getProfile: () => Promise<any>;
  updateProfile: (profileData: any) => Promise<any>;
  getAnalytics: (params?: { period?: string; startDate?: string; endDate?: string }) => Promise<any>;
  getReviews: (params?: { page?: number; limit?: number }) => Promise<any>;
  respondToReview: (reviewId: string, response: string) => Promise<any>;
  getEarnings: (params?: { period?: string; startDate?: string; endDate?: string }) => Promise<any>;
  requestWithdrawal: (amount: number) => Promise<any>;
  getTransactionHistory: (params?: { page?: number; limit?: number }) => Promise<any>;
  
  // Notification methods
  getNotifications: () => Promise<{
    notifications: Array<{
      id: string;
      type: "new_job" | "job_status" | "review" | "payment";
      title: string;
      message: string;
      created_at: string;
      read: boolean;
    }>;
    unread_count: number;
  }>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
} 