# Frontend-Backend Integration Guide

## Overview
This guide explains how the React frontend integrates with the FastAPI backend in the Connectify Nigeria platform.

## Architecture

### Frontend (React)
- Built with React + TypeScript
- Uses Vite as build tool
- State management with React Query
- UI components with shadcn/ui
- Real-time updates with WebSocket

### Backend (FastAPI)
- Built with FastAPI
- SQLAlchemy for database operations
- JWT for authentication
- WebSocket for real-time features
- OpenAPI/Swagger documentation

## Integration Points

### 1. API Service Layer
The frontend uses a service layer to communicate with the backend:

```typescript
// src/services/serviceFactory.ts
export interface Service {
  getDashboardStats: () => Promise<any>;
  getJobs: (params?: JobParams) => Promise<any>;
  // ... other methods
}

// Mock service for development
class MockService implements Service {
  // Implementation with mock data
}

// Real API service
class ApiService implements Service {
  // Implementation with real API calls
}

// Service factory
export const service = USE_MOCK ? mockService : apiService;
```

### 2. Authentication Flow
```typescript
// src/contexts/UserContext.tsx
export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const login = async (credentials) => {
    const response = await service.login(credentials);
    localStorage.setItem('token', response.token);
    setIsAuthenticated(true);
    setUserRole(response.role);
  };

  // ... other auth methods
};
```

### 3. Real-time Updates
```typescript
// src/components/ui/notifications.tsx
const setupWebSocket = () => {
  const ws = new WebSocket(process.env.REACT_APP_WS_URL);
  
  ws.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    setNotifications(prev => [notification, ...prev]);
  };
};
```

### 4. Data Fetching with React Query
```typescript
// src/pages/provider/Dashboard.tsx
const { data: dashboardData } = useQuery({
  queryKey: ['dashboard'],
  queryFn: () => service.getDashboardStats()
});

const { mutate: updateJobStatus } = useMutation({
  mutationFn: ({ jobId, status }) => 
    service.updateJobStatus(jobId, status),
  onSuccess: () => {
    queryClient.invalidateQueries(['jobs']);
  }
});
```

## Error Handling

### Frontend Error Handling
```typescript
// src/services/apiService.ts
class ApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor
    this.axiosInstance.interceptors.response.use(
      response => response.data,
      error => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}
```

### Backend Error Handling
```python
# backend/app/utils/error_handlers.py
from fastapi import HTTPException

class APIError(HTTPException):
    def __init__(self, code: str, message: str, status_code: int = 400):
        super().__init__(
            status_code=status_code,
            detail={
                "error": {
                    "code": code,
                    "message": message
                }
            }
        )
```

## Data Flow

### 1. Provider Dashboard
```mermaid
sequenceDiagram
    Frontend->>Backend: GET /provider/dashboard
    Backend->>Database: Query stats and jobs
    Database->>Backend: Return data
    Backend->>Frontend: Return dashboard data
    Frontend->>Frontend: Update UI with data
```

### 2. Real-time Notifications
```mermaid
sequenceDiagram
    Backend->>Frontend: WebSocket notification
    Frontend->>Frontend: Update notifications state
    Frontend->>Frontend: Show toast notification
```

## Testing Integration

### 1. API Contract Testing
```typescript
// src/__tests__/api/contract.test.ts
import { OpenAPI } from 'openapi-types';

describe('API Contract', () => {
  it('matches OpenAPI spec', () => {
    const spec = require('../config/api-contract.json');
    const validator = new OpenAPI(spec);
    // Test endpoints against spec
  });
});
```

### 2. Integration Testing
```typescript
// src/__tests__/integration/provider-dashboard.test.tsx
describe('Provider Dashboard Integration', () => {
  it('fetches and displays dashboard data', async () => {
    render(<ProviderDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Total Jobs')).toBeInTheDocument();
    });
  });
});
```

## Development Workflow

### 1. Local Development
```bash
# Start backend
cd backend
uvicorn app.main:app --reload

# Start frontend
cd frontend
npm run dev
```

### 2. Environment Variables
```env
# Frontend (.env)
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_WS_URL=ws://localhost:8000/ws
REACT_APP_USE_MOCK=true

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/connectify
JWT_SECRET=your-secret-key
```

### 3. API Documentation
- Backend: http://localhost:8000/docs (Swagger UI)
- Frontend: API contract in `src/config/api-contract.json`

## Deployment

### 1. Backend Deployment
```bash
# Build Docker image
docker build -t connectify-backend .

# Run container
docker run -p 8000:8000 connectify-backend
```

### 2. Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to hosting service
npm run deploy
```

## Monitoring and Logging

### 1. Frontend Logging
```typescript
// src/utils/logger.ts
export const logger = {
  error: (error: Error) => {
    console.error(error);
    // Send to error tracking service
  },
  info: (message: string) => {
    console.log(message);
    // Log to analytics
  }
};
```

### 2. Backend Logging
```python
# backend/app/utils/logger.py
import logging

logger = logging.getLogger(__name__)

def log_api_call(endpoint: str, method: str, status: int):
    logger.info(f"{method} {endpoint} - {status}")
```

## Security Considerations

### 1. CORS Configuration
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Rate Limiting
```python
# backend/app/middleware/rate_limit.py
from fastapi import Request
from fastapi.responses import JSONResponse

async def rate_limit_middleware(request: Request):
    # Implement rate limiting logic
    pass
```

## Performance Optimization

### 1. Frontend
- React Query caching
- Code splitting
- Lazy loading components
- Image optimization

### 2. Backend
- Database query optimization
- Response compression
- Caching frequently accessed data
- Connection pooling

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in backend
   - Verify frontend URL is allowed

2. **Authentication Issues**
   - Check token expiration
   - Verify token format
   - Check authorization headers

3. **WebSocket Connection**
   - Check WebSocket URL
   - Verify connection status
   - Check for firewall issues

4. **API Response Errors**
   - Check API contract
   - Verify request/response format
   - Check error handling

### Debug Tools

1. **Frontend**
   - React Developer Tools
   - Network tab in browser dev tools
   - Redux DevTools (if using Redux)

2. **Backend**
   - FastAPI debug mode
   - Database query logging
   - Request/response logging 