# API Documentation

## Overview
This document provides detailed information about the Connectify Nigeria API endpoints, request/response formats, and authentication requirements.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All API endpoints require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Provider Endpoints

### Dashboard
Get provider dashboard statistics and recent activities.

```http
GET /provider/dashboard
```

#### Response
```json
{
  "stats": {
    "totalJobs": 156,
    "activeJobs": 8,
    "completedJobs": 148,
    "totalEarnings": 1250000,
    "averageRating": 4.8
  },
  "recentJobs": [
    {
      "id": "123",
      "title": "Plumbing Service",
      "status": "completed",
      "date": "2024-03-15T10:30:00Z",
      "amount": 15000
    }
  ],
  "upcomingJobs": [
    {
      "id": "124",
      "title": "Electrical Repair",
      "status": "scheduled",
      "date": "2024-03-16T14:00:00Z",
      "amount": 20000
    }
  ]
}
```

### Jobs
Manage provider jobs.

#### List Jobs
```http
GET /provider/jobs
```

Query Parameters:
- `status` (optional): Filter by job status
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `sort_by` (optional): Field to sort by
- `sort_order` (optional): Sort order (asc/desc)
- `search` (optional): Search term
- `date_from` (optional): Filter by start date
- `date_to` (optional): Filter by end date
- `service_type` (optional): Filter by service type
- `min_amount` (optional): Minimum job amount
- `max_amount` (optional): Maximum job amount

#### Update Job Status
```http
PATCH /provider/jobs/{jobId}/status
```

Request Body:
```json
{
  "status": "completed"
}
```

### Profile
Manage provider profile.

#### Get Profile
```http
GET /provider/profile
```

#### Update Profile
```http
PUT /provider/profile
```

Request Body:
```json
{
  "name": "John Doe",
  "phone": "+2348012345678",
  "services": ["plumbing", "electrical"]
}
```

### Analytics
Get provider analytics data.

```http
GET /provider/analytics
```

Query Parameters:
- `period` (optional): Time period (day/week/month/year)
- `startDate` (optional): Start date for custom period
- `endDate` (optional): End date for custom period

Response:
```json
{
  "bookings": {
    "total": 156,
    "byStatus": {
      "completed": 148,
      "active": 8
    },
    "trend": [
      {
        "date": "2024-03-01",
        "count": 5
      }
    ]
  },
  "revenue": {
    "total": 1250000,
    "byPeriod": [
      {
        "period": "2024-03",
        "amount": 150000
      }
    ],
    "trend": [
      {
        "date": "2024-03-01",
        "amount": 5000
      }
    ]
  },
  "ratings": {
    "average": 4.8,
    "distribution": {
      "5": 120,
      "4": 25,
      "3": 8,
      "2": 2,
      "1": 1
    },
    "trend": [
      {
        "date": "2024-03-01",
        "rating": 4.9
      }
    ]
  }
}
```

### Reviews
Manage provider reviews.

#### List Reviews
```http
GET /provider/reviews
```

Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `sort_by` (optional): Sort field
- `sort_order` (optional): Sort order
- `rating` (optional): Filter by rating
- `date_from` (optional): Filter by start date
- `date_to` (optional): Filter by end date
- `has_response` (optional): Filter by response status

#### Respond to Review
```http
POST /provider/reviews/{reviewId}/respond
```

Request Body:
```json
{
  "response": "Thank you for your feedback!"
}
```

### Earnings
Manage provider earnings.

#### Get Earnings
```http
GET /provider/earnings
```

Query Parameters:
- `period` (optional): Time period
- `startDate` (optional): Start date
- `endDate` (optional): End date

Response:
```json
{
  "total_earnings": 1250000,
  "pending_earnings": 35000,
  "earnings_trend": 15.6,
  "recent_transactions": [
    {
      "id": "tx_123",
      "type": "job_payment",
      "amount": 15000,
      "status": "completed",
      "created_at": "2024-03-15T10:30:00Z"
    }
  ],
  "monthly_earnings": [
    {
      "month": "2024-03",
      "amount": 150000
    }
  ],
  "weekly_earnings": [
    {
      "day": "Monday",
      "amount": 25000
    }
  ],
  "service_earnings": [
    {
      "service": "plumbing",
      "amount": 500000
    }
  ]
}
```

#### Request Withdrawal
```http
POST /provider/earnings/withdraw
```

Request Body:
```json
{
  "amount": 50000
}
```

#### Get Transaction History
```http
GET /provider/earnings/transactions
```

Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `sort_by` (optional): Sort field
- `sort_order` (optional): Sort order
- `type` (optional): Transaction type
- `status` (optional): Transaction status
- `date_from` (optional): Start date
- `date_to` (optional): End date
- `min_amount` (optional): Minimum amount
- `max_amount` (optional): Maximum amount

### Notifications
Manage provider notifications.

#### List Notifications
```http
GET /provider/notifications
```

Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Notification type
- `read` (optional): Read status
- `date_from` (optional): Start date
- `date_to` (optional): End date

#### Mark as Read
```http
PATCH /provider/notifications/{notificationId}/read
```

#### Mark All as Read
```http
PATCH /provider/notifications/read-all
```

#### Get Notification Preferences
```http
GET /provider/notifications/preferences
```

#### Update Notification Preferences
```http
PUT /provider/notifications/preferences
```

Request Body:
```json
{
  "email": {
    "new_job": true,
    "job_status": true,
    "review": true,
    "payment": true
  },
  "push": {
    "new_job": true,
    "job_status": true,
    "review": true,
    "payment": true
  }
}
```

## WebSocket Endpoints

### Real-time Notifications
```
ws://localhost:8000/ws
```

Message Format:
```json
{
  "type": "new_job",
  "title": "New Job Request",
  "message": "You have a new job request for Plumbing Service",
  "created_at": "2024-03-15T10:30:00Z"
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `INVALID_REQUEST`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `PERMISSION_DENIED`: Insufficient permissions
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## CORS Configuration
- Allowed Origins: `http://localhost:3000`
- Allowed Methods: GET, POST, PUT, PATCH, DELETE
- Allowed Headers: Content-Type, Authorization
- Max Age: 3600 seconds 