# Connectify Nigeria Backend API

A Flask-based RESTful API for the Connectify Nigeria platform, providing services for connecting customers with service providers.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Development](#development)

## Features

- 🔐 JWT-based Authentication
- 👥 User Management (Customers & Providers)
- 📅 Booking System
- �� Payment Processing
- 🔔 Notification System
- ⭐ Provider Rating System
- 📍 Location-based Services
- 🔍 Service Categorization

## Tech Stack

- **Framework**: Flask
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: Flask-JWT-Extended
- **Security**: Werkzeug Security
- **CORS**: Flask-CORS
- **API**: RESTful

## Prerequisites

- Python 3.8+
- pip (Python package manager)
- Virtual environment (recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd connectify-nigeria/backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
flask db init
flask db migrate
flask db upgrade
```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
JWT_SECRET_KEY=your-secret-key
FLASK_ENV=development
FLASK_APP=app.py
```

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
- Login user
- Required fields: email, password
- Returns: JWT token and user info

#### POST `/api/auth/signup`
- Register new user
- Required fields: name, email, password
- Optional: userType (customer/provider)

#### GET `/api/auth/me`
- Get current user info
- Requires: JWT token

### User Management

#### GET `/api/users/<user_id>`
- Get user profile
- Requires: JWT token

#### PUT `/api/users/<user_id>`
- Update user profile
- Requires: JWT token

### Provider Management

#### GET `/api/providers`
- List all service providers
- Returns: Provider details with user information

#### GET `/api/providers/<provider_id>`
- Get specific provider details

### Booking System

#### POST `/api/bookings`
- Create new booking
- Required fields: service, date, time, location
- Requires: JWT token

#### GET `/api/bookings`
- List user's bookings
- Requires: JWT token

### Payment System

#### POST `/api/payments`
- Process payment for booking
- Required fields: amount, method
- Requires: JWT token

### Notification System

#### POST `/api/notifications`
- Send notification to user
- Requires: JWT token

## Database Schema

### User
- id (Primary Key)
- name
- email (Unique)
- phone
- location
- role (customer/provider)
- notifications
- password_hash
- paymentMethods (JSON)

### Provider
- id (Primary Key)
- user_id (Foreign Key)
- photo
- rating
- price
- category
- location
- bio
- services (JSON)
- availability (JSON)
- reviews (JSON)

### Booking
- id (Primary Key)
- user_id (Foreign Key)
- provider_id (Foreign Key)
- service
- date
- time
- location
- notes
- status
- cost
- is_paid

### Payment
- id (Primary Key)
- booking_id (Foreign Key)
- amount
- method
- details (JSON)
- status

### Service
- id (Primary Key)
- name (Unique)
- description
- category

### Notification
- id (Primary Key)
- user_id (Foreign Key)
- message
- created_at

## Security

- JWT-based authentication
- Password hashing using Werkzeug
- CORS configuration
- Role-based access control
- User authorization checks

## Development

### Running the Server

```bash
flask run
```

### Testing

```bash
python -m pytest
```

### Database Migrations

```bash
flask db migrate -m "migration message"
flask db upgrade
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here]