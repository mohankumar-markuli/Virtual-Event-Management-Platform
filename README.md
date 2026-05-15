# Virtual Event Management Platform

A scalable backend application for managing virtual events with secure authentication, role-based access control, event registrations, email notifications, and complete automated testing.

# Features

## Authentication & Authorization

- User Signup
- User Login
- User Logout
- JWT Authentication
- Cookie-based session handling
- Role-based access control
- Admin protected routes

## User Management

- View Profile
- Edit Profile
- Change Password
- Password validation
- Strong password enforcement

## Event Management

- Create Event
- View All Events
- View Single Event
- Update Event
- Delete Event
- Event data validation
- Event date & timezone validation

## Registration Management

- Register for Event
- View My Registrations
- Cancel Registration
- Delete Registration
- Duplicate registration prevention

## Email Notifications

Automated email notifications for:

- Event Registration
- Registration Cancellation
- Registration Deletion

# Tech Stack

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT
- bcrypt

## Validation

- validator.js

## Testing

- Jest
- Supertest
- MongoMemoryServer

# Project Architecture

```text
src
│
├── config
├── controllers
├── middlewares
├── models
├── routes
├── services
├── utils
```

# MVC Architecture

## Models

Handles:

- database schema
- database operations
- validations

## Controllers

Handles:

- request/response cycle
- API response formatting

## Services

Handles:

- business logic
- reusable logic
- database coordination

## Routes

Handles:

- endpoint mapping
- middleware chaining

## Middlewares

Handles:

- authentication
- validation
- logging
- error handling

# API Endpoints

### Auth Routes

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| POST   | `/api/v1/auth/signup` | Register user |
| POST   | `/api/v1/auth/login`  | Login user    |
| POST   | `/api/v1/auth/logout` | Logout user   |

---

### User Routes

| Method | Endpoint                | Description     |
| ------ | ----------------------- | --------------- |
| GET    | `/api/v1/user/profile`  | View profile    |
| PATCH  | `/api/v1/user/profile`  | Edit profile    |
| PATCH  | `/api/v1/user/password` | Change password |

---

### Event Routes

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/v1/events`     | Create event      |
| GET    | `/api/v1/events`     | View all events   |
| GET    | `/api/v1/events/:id` | View single event |
| PATCH  | `/api/v1/events/:id` | Update event      |
| DELETE | `/api/v1/events/:id` | Delete event      |

---

### Registration Routes

| Method | Endpoint                                                      | Description         |
| ------ | ------------------------------------------------------------- | ------------------- |
| POST   | `/api/v1/registration/:eventId/register`                      | Register for event  |
| GET    | `/api/v1/registration/myRegistrations`                        | View registrations  |
| PATCH  | `/api/v1/registration/myRegistrations/:registrationId/cancel` | Cancel registration |
| DELETE | `/api/v1/registration/myRegistrations/:registrationId`        | Delete registration |

# Security Features

- JWT Authentication
- Protected Routes
- Password Hashing
- Role Authorization
- Input Validation
- Restricted Field Updates
- Strong Password Enforcement

# Validation Features

## User Validation

- Email validation
- Password strength validation
- Name validation
- Role validation

## Event Validation

- Title validation
- Future date validation
- Timezone validation
- Max attendee validation

# Testing Architecture

The project contains:

- Unit Testing
- Integration Testing
- Route Testing
- Middleware Testing
- Service Testing
- Controller Testing
- Model Testing

# Test Structure

```text
test
│
├── config
├── controllers
├── middlewares
├── models
├── routes
├── services
└── utils
```

# Testing Tools

- Jest
- Supertest
- MongoMemoryServer

# Current Test Coverage

```text
Statements : 93%+
Functions  : 100%
Lines      : 93%+
Branches   : 77%+
```

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

# Environment Variables

Create `.env`

```env
PORT=3000

MONGO_URI=your_mongodb_connection

JWT_SECRET_KEY=your_secret_key

SALT_ROUNDS=10

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

# Run Application

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

# Run Tests

## Run All Tests

```bash
npm test
```

## Run Coverage

```bash
npm run test:coverage
```
