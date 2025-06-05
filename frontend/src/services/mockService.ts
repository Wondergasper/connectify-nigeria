import mockData from '../config/mock-data.json';
import apiContract from '../config/api-contract.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiContract.baseUrl;
  }

  private async mockRequest<T>(data: T, errorRate: number = 0): Promise<T> {
    await delay(Math.random() * 1000); // Simulate network delay
    
    if (Math.random() < errorRate) {
      throw new Error('Mock API Error');
    }
    
    return data;
  }

  // Dashboard
  async getDashboardStats() {
    return this.mockRequest(mockData.provider.dashboard);
  }

  // Jobs
  async getJobs(params: { status?: string; page?: number; limit?: number } = {}) {
    const { jobs, total, page, limit } = mockData.provider.jobs.list;
    return this.mockRequest({
      jobs: jobs.slice(0, params.limit || limit),
      total,
      page: params.page || page,
      limit: params.limit || limit
    });
  }

  async updateJobStatus(jobId: string, status: string) {
    return this.mockRequest({ success: true, jobId, status });
  }

  // Profile
  async getProfile() {
    return this.mockRequest(mockData.provider.profile);
  }

  async updateProfile(profileData: Partial<typeof mockData.provider.profile>) {
    return this.mockRequest({
      ...mockData.provider.profile,
      ...profileData
    });
  }

  // Analytics
  async getAnalytics(params: { period?: string; startDate?: string; endDate?: string } = {}) {
    return this.mockRequest(mockData.provider.analytics);
  }

  // Reviews
  async getReviews(params: { page?: number; limit?: number } = {}) {
    const { reviews, total, page, limit } = mockData.provider.reviews;
    return this.mockRequest({
      reviews: reviews.slice(0, params.limit || limit),
      total,
      page: params.page || page,
      limit: params.limit || limit
    });
  }

  async respondToReview(reviewId: string, response: string) {
    return this.mockRequest({
      success: true,
      reviewId,
      response
    });
  }

  // Earnings
  async getEarnings(params: { period?: string; startDate?: string; endDate?: string } = {}) {
    return this.mockRequest(mockData.provider.earnings);
  }

  async requestWithdrawal(amount: number) {
    return this.mockRequest({
      success: true,
      amount,
      status: 'pending',
      estimated_completion: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours from now
    });
  }

  async getTransactionHistory(params: { page?: number; limit?: number } = {}) {
    const { transactions, total, page, limit } = mockData.provider.earnings.transactions;
    return this.mockRequest({
      transactions: transactions.slice(0, params.limit || limit),
      total,
      page: params.page || page,
      limit: params.limit || limit
    });
  }

  async getNotifications() {
    return {
      notifications: [
        {
          id: "1",
          type: "new_job",
          title: "New Job Request",
          message: "You have a new job request for Plumbing Service",
          created_at: new Date().toISOString(),
          read: false,
        },
        {
          id: "2",
          type: "job_status",
          title: "Job Completed",
          message: "Your job #123 has been marked as completed",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: true,
        },
        {
          id: "3",
          type: "review",
          title: "New Review",
          message: "You received a 5-star review from John Doe",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          read: false,
        },
        {
          id: "4",
          type: "payment",
          title: "Payment Received",
          message: "You received a payment of $150 for job #123",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          read: true,
        },
      ],
      unread_count: 2,
    };
  }

  async markNotificationAsRead(notificationId: string) {
    // Mock implementation - in a real service, this would make an API call
    return;
  }

  async markAllNotificationsAsRead() {
    // Mock implementation - in a real service, this would make an API call
    return;
  }
}

export const mockService = new MockService(); 