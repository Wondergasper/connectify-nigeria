// Common Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'provider' | 'admin';
  created_at: string;
  updated_at: string;
}

// Provider Types
export interface Provider {
  id: string;
  user_id: string;
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  business_description: string;
  service_categories: string[];
  service_areas: string[];
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface ProviderUpdate {
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  business_description?: string;
  service_categories?: string[];
  service_areas?: string[];
  availability?: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
}

// Job Types
export interface Job {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  amount: number;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  created_at: string;
  updated_at: string;
}

// Review Types
export interface Review {
  id: string;
  job_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  job_title: string;
  created_at: string;
  provider_response?: string;
}

export interface Payment {
  id: number;
  job_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

// API Response Types
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
  };
}

export interface ProviderProfileResponse {
  provider: Provider;
  user: User;
  jobs: Job[];
}

export interface JobStatsResponse {
  new_requests: number;
  active_jobs: number;
  completed_jobs: number;
  total_earnings: number;
  earnings_trend: number;
  jobs_trend: number;
  earnings_overview: {
    daily: Array<{
      day: string;
      amount: number;
    }>;
  };
  max_earnings: number;
}

export interface EarningsResponse {
  total_earnings: number;
  period_earnings: number;
  earnings_by_period: {
    period: string;
    amount: number;
  }[];
  recent_payments: {
    id: string;
    amount: number;
    status: string;
    created_at: string;
  }[];
}

export interface ReviewsResponse {
  average_rating: number;
  total_reviews: number;
  reviews: Review[];
}

// Analytics Types
export interface AnalyticsResponse {
  total_jobs: number;
  completed_jobs: number;
  total_earnings: number;
  average_rating: number;
  jobs_by_category: {
    category: string;
    count: number;
  }[];
  earnings_by_month: {
    month: string;
    amount: number;
  }[];
  customer_ratings: {
    rating: number;
    count: number;
  }[];
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
} 