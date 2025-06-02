# Testing Documentation

## Overview
This document outlines the testing strategy for Connectify Nigeria's provider platform, covering both frontend and backend testing.

## Backend Testing

### API Endpoints Testing
All API endpoints should be tested using pytest. Test files are located in `backend/tests/`.

#### Running Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_provider_api.py

# Run with coverage
pytest --cov=app tests/
```

#### Test Categories
1. **Unit Tests**
   - Test individual functions and methods
   - Mock external dependencies
   - Located in `tests/unit/`

2. **Integration Tests**
   - Test API endpoints
   - Test database interactions
   - Located in `tests/integration/`

3. **Authentication Tests**
   - Test JWT token generation and validation
   - Test role-based access control
   - Located in `tests/auth/`

### Example Test Structure
```python
# tests/integration/test_provider_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_provider_dashboard():
    response = client.get("/api/v1/provider/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "stats" in data
    assert "recentJobs" in data
    assert "upcomingJobs" in data

def test_update_job_status():
    response = client.patch(
        "/api/v1/provider/jobs/123/status",
        json={"status": "completed"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
```

## Frontend Testing

### Component Testing
Using React Testing Library and Jest for component testing.

#### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

#### Test Categories
1. **Unit Tests**
   - Test individual components
   - Test hooks and utilities
   - Located in `src/__tests__/`

2. **Integration Tests**
   - Test component interactions
   - Test API integration
   - Located in `src/__tests__/integration/`

### Example Test Structure
```typescript
// src/__tests__/components/Notifications.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Notifications } from '@/components/ui/notifications';
import { service } from '@/services/serviceFactory';

jest.mock('@/services/serviceFactory');

describe('Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders notifications list', async () => {
    const mockNotifications = {
      notifications: [
        {
          id: '1',
          type: 'new_job',
          title: 'New Job',
          message: 'You have a new job request',
          created_at: new Date().toISOString(),
          read: false
        }
      ],
      unread_count: 1
    };

    (service.getNotifications as jest.Mock).mockResolvedValue(mockNotifications);

    render(<Notifications />);
    
    expect(await screen.findByText('New Job')).toBeInTheDocument();
    expect(screen.getByText('You have a new job request')).toBeInTheDocument();
  });
});
```

## API Contract Testing

### OpenAPI/Swagger Testing
- Validate API responses against OpenAPI schema
- Test request/response formats
- Located in `tests/api_contract/`

### Example Contract Test
```python
# tests/api_contract/test_provider_endpoints.py
from openapi_core import OpenAPI
from openapi_core.validation.request.validators import RequestValidator
from openapi_core.validation.response.validators import ResponseValidator

def test_provider_dashboard_contract():
    # Load OpenAPI spec
    spec_dict = yaml.safe_load(open('openapi.yaml'))
    openapi = OpenAPI.from_dict(spec_dict)
    
    # Validate response
    response = client.get("/api/v1/provider/dashboard")
    result = ResponseValidator(openapi).validate(response)
    assert not result.errors
```

## WebSocket Testing

### Real-time Updates Testing
```typescript
// src/__tests__/websocket/notifications.test.ts
import { WebSocket } from 'ws';

describe('WebSocket Notifications', () => {
  let ws: WebSocket;

  beforeEach(() => {
    ws = new WebSocket('ws://localhost:8000/ws');
  });

  afterEach(() => {
    ws.close();
  });

  it('receives real-time notifications', (done) => {
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      expect(notification).toHaveProperty('type');
      expect(notification).toHaveProperty('title');
      done();
    };
  });
});
```

## End-to-End Testing

### Cypress Tests
Located in `cypress/integration/`

```typescript
// cypress/integration/provider-dashboard.spec.ts
describe('Provider Dashboard', () => {
  beforeEach(() => {
    cy.login('provider');
    cy.visit('/provider-dashboard');
  });

  it('displays dashboard stats', () => {
    cy.get('[data-testid="total-jobs"]').should('be.visible');
    cy.get('[data-testid="active-jobs"]').should('be.visible');
    cy.get('[data-testid="total-earnings"]').should('be.visible');
  });

  it('shows real-time notifications', () => {
    cy.get('[data-testid="notifications-bell"]').click();
    cy.get('[data-testid="notifications-list"]').should('be.visible');
  });
});
```

## Performance Testing

### Load Testing
Using k6 for load testing:

```javascript
// tests/load/provider-api.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function() {
  const response = http.get('http://localhost:8000/api/v1/provider/dashboard');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

## Security Testing

### Authentication Testing
- Test JWT token validation
- Test role-based access
- Test session management

### API Security Testing
- Test rate limiting
- Test input validation
- Test CORS configuration

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run backend tests
        run: pytest --cov=app tests/
      - name: Set up Node.js
        uses: actions/setup-node@v2
      - name: Install frontend dependencies
        run: npm install
      - name: Run frontend tests
        run: npm test
```

## Test Coverage Requirements
- Backend: Minimum 80% coverage
- Frontend: Minimum 70% coverage
- API Contract: 100% coverage
- E2E: Critical user flows 