import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API responses
export const handlers = [
  // Dashboard
  rest.get('/api/v1/provider/dashboard', (req, res, ctx) => {
    return res(
      ctx.json({
        stats: {
          totalJobs: 156,
          activeJobs: 8,
          completedJobs: 148,
          totalEarnings: 1250000,
          averageRating: 4.8
        },
        recentJobs: [
          {
            id: '123',
            title: 'Plumbing Service',
            status: 'completed',
            date: '2024-03-15T10:30:00Z',
            amount: 15000
          }
        ],
        upcomingJobs: [
          {
            id: '124',
            title: 'Electrical Repair',
            status: 'scheduled',
            date: '2024-03-16T14:00:00Z',
            amount: 20000
          }
        ]
      })
    );
  }),

  // Jobs
  rest.get('/api/v1/provider/jobs', (req, res, ctx) => {
    return res(
      ctx.json({
        jobs: [
          {
            id: '123',
            title: 'Plumbing Service',
            description: 'Fix leaking pipe',
            status: 'completed',
            date: '2024-03-15T10:30:00Z',
            amount: 15000
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      })
    );
  }),

  // Profile
  rest.get('/api/v1/provider/profile', (req, res, ctx) => {
    return res(
      ctx.json({
        name: 'Test Provider',
        email: 'test@example.com',
        phone: '+2348012345678',
        services: ['plumbing', 'electrical'],
        rating: 4.8,
        completedJobs: 148
      })
    );
  }),

  // Analytics
  rest.get('/api/v1/provider/analytics', (req, res, ctx) => {
    return res(
      ctx.json({
        bookings: {
          total: 156,
          byStatus: {
            completed: 148,
            active: 8
          },
          trend: [
            {
              date: '2024-03-01',
              count: 5
            }
          ]
        },
        revenue: {
          total: 1250000,
          byPeriod: [
            {
              period: '2024-03',
              amount: 150000
            }
          ],
          trend: [
            {
              date: '2024-03-01',
              amount: 5000
            }
          ]
        },
        ratings: {
          average: 4.8,
          distribution: {
            '5': 120,
            '4': 25,
            '3': 8,
            '2': 2,
            '1': 1
          },
          trend: [
            {
              date: '2024-03-01',
              rating: 4.9
            }
          ]
        }
      })
    );
  }),

  // Earnings
  rest.get('/api/v1/provider/earnings', (req, res, ctx) => {
    return res(
      ctx.json({
        total_earnings: 1250000,
        pending_earnings: 35000,
        earnings_trend: 15.6,
        recent_transactions: [
          {
            id: 'tx_123',
            type: 'job_payment',
            amount: 15000,
            status: 'completed',
            created_at: '2024-03-15T10:30:00Z'
          }
        ],
        monthly_earnings: [
          {
            month: '2024-03',
            amount: 150000
          }
        ],
        weekly_earnings: [
          {
            day: 'Monday',
            amount: 25000
          }
        ],
        service_earnings: [
          {
            service: 'plumbing',
            amount: 500000
          }
        ]
      })
    );
  })
];

export const server = setupServer(...handlers); 