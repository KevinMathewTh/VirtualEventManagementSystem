# Virtual Event Management Platform - Backend API Documentation

## Overview
This is a comprehensive backend system for a virtual event management platform built with Node.js and Express.js. It features secure user authentication, event management capabilities, and participant registration with email notifications.

## Technologies Used
- **Node.js & Express.js** - Backend framework
- **bcryptjs** - Password hashing
- **jsonwebtoken (JWT)** - Session management and authentication
- **nodemailer** - Email notifications
- **dotenv** - Environment variable management
- **In-Memory Data Storage** - Users and events stored in memory

## Project Structure
```
VirtualPlatform/
├── middleware/
│   └── auth.js                 # JWT verification and authorization middleware
├── routes/
│   ├── auth.js                 # Authentication endpoints
│   └── events.js               # Event management endpoints
├── utils/
│   ├── database.js             # In-memory data storage
│   ├── emailService.js         # Email notification service
│   └── validators.js           # Input validation utilities
├── server.js                   # Main server file
├── package.json                # Project dependencies
├── .env                        # Environment variables (configuration)
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn
- Mailtrap account (for email testing) or any SMTP service

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables** (`.env` file):
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   
   # Email Configuration
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=465
   EMAIL_USER=your_mailtrap_user
   EMAIL_PASS=your_mailtrap_pass
   EMAIL_FROM=noreply@virtualeventplatform.com
   ```

3. **Start the server:**
   ```bash
   npm start                      # Production
   npm run dev                    # Development (with nodemon)
   ```

4. The server will be running at `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
- **URL:** `POST /api/auth/register`
- **Description:** Register a new user account
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "attendee"  // or "organizer"
  }
  ```
- **Response (201 - Created):**
  ```json
  {
    "message": "User registered successfully. Check your email for confirmation.",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "attendee"
    }
  }
  ```
- **Error Responses:**
  - 400: Missing required fields or invalid email/password
  - 409: Email already registered

#### 2. User Login
- **URL:** `POST /api/auth/login`
- **Description:** Authenticate user and receive JWT token
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200 - OK):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "attendee"
    }
  }
  ```
- **Error Responses:**
  - 400: Missing email or password
  - 401: Invalid credentials

---

### Event Management Endpoints

#### 3. Get All Events
- **URL:** `GET /api/events`
- **Description:** Retrieve all available events
- **Auth Required:** No
- **Response (200 - OK):**
  ```json
  {
    "message": "Events retrieved successfully",
    "events": [
      {
        "id": 1,
        "name": "Web Development Workshop",
        "description": "Learn modern web development",
        "date": "2025-12-15",
        "time": "14:00",
        "location": "Online",
        "maxParticipants": 100,
        "organizerId": 1,
        "organizer": "Jane Smith",
        "participants": [2, 3, 4],
        "participantCount": 3,
        "createdAt": "2025-11-26T10:30:00.000Z",
        "updatedAt": "2025-11-26T10:30:00.000Z"
      }
    ],
    "total": 1
  }
  ```

#### 4. Get Event by ID
- **URL:** `GET /api/events/:id`
- **Description:** Retrieve details of a specific event
- **Auth Required:** No
- **URL Parameters:**
  - `id` (integer): Event ID
- **Response (200 - OK):**
  ```json
  {
    "message": "Event retrieved successfully",
    "event": {
      "id": 1,
      "name": "Web Development Workshop",
      "description": "Learn modern web development",
      "date": "2025-12-15",
      "time": "14:00",
      "location": "Online",
      "maxParticipants": 100,
      "organizerId": 1,
      "organizer": "Jane Smith",
      "participants": [2, 3, 4],
      "participantCount": 3,
      "createdAt": "2025-11-26T10:30:00.000Z",
      "updatedAt": "2025-11-26T10:30:00.000Z"
    }
  }
  ```
- **Error Response:**
  - 404: Event not found

#### 5. Create Event
- **URL:** `POST /api/events`
- **Description:** Create a new event (organizers only)
- **Auth Required:** Yes (organizer role)
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Request Body:**
  ```json
  {
    "name": "Web Development Workshop",
    "description": "Learn modern web development with React",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Online",
    "maxParticipants": 100
  }
  ```
- **Response (201 - Created):**
  ```json
  {
    "message": "Event created successfully",
    "event": {
      "id": 1,
      "name": "Web Development Workshop",
      "description": "Learn modern web development with React",
      "date": "2025-12-15",
      "time": "14:00",
      "location": "Online",
      "maxParticipants": 100,
      "organizerId": 1,
      "organizer": "Jane Smith",
      "participants": [],
      "participantCount": 0,
      "createdAt": "2025-11-26T10:30:00.000Z",
      "updatedAt": "2025-11-26T10:30:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - 400: Missing required fields or invalid date/time
  - 401: Unauthorized (no token)
  - 403: Forbidden (not an organizer)

#### 6. Update Event
- **URL:** `PUT /api/events/:id`
- **Description:** Update event details (organizer only)
- **Auth Required:** Yes (event organizer)
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **URL Parameters:**
  - `id` (integer): Event ID
- **Request Body:** (All fields optional)
  ```json
  {
    "name": "Advanced Web Development Workshop",
    "description": "Learn advanced React patterns",
    "date": "2025-12-20",
    "time": "15:00",
    "location": "Hybrid",
    "maxParticipants": 50
  }
  ```
- **Response (200 - OK):**
  ```json
  {
    "message": "Event updated successfully",
    "event": { /* Updated event data */ }
  }
  ```
- **Error Responses:**
  - 404: Event not found
  - 403: Not authorized to update this event

#### 7. Delete Event
- **URL:** `DELETE /api/events/:id`
- **Description:** Delete an event (organizer only)
- **Auth Required:** Yes (event organizer)
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **URL Parameters:**
  - `id` (integer): Event ID
- **Response (200 - OK):**
  ```json
  {
    "message": "Event deleted successfully",
    "deletedEvent": { /* Deleted event data */ }
  }
  ```
- **Error Responses:**
  - 404: Event not found
  - 403: Not authorized to delete this event

#### 8. Register for Event
- **URL:** `POST /api/events/:id/register`
- **Description:** Register user for an event
- **Auth Required:** Yes
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **URL Parameters:**
  - `id` (integer): Event ID
- **Response (201 - Created):**
  ```json
  {
    "message": "Successfully registered for event. Confirmation email sent.",
    "event": {
      "id": 1,
      "name": "Web Development Workshop",
      "participants": [1, 2, 3],
      "participantCount": 3,
      /* ... other event data ... */
    }
  }
  ```
- **Error Responses:**
  - 404: Event not found
  - 400: User already registered or event at capacity
  - 401: Unauthorized (no token)

---

### Health Check Endpoint

#### 9. Health Check
- **URL:** `GET /api/health`
- **Description:** Check if the server is running
- **Auth Required:** No
- **Response (200 - OK):**
  ```json
  {
    "message": "Virtual Event Platform API is running",
    "timestamp": "2025-11-26T10:30:00.000Z"
  }
  ```

---

## Authentication

### JWT Token Usage
1. Register a user account
2. Login to receive a JWT token
3. Include the token in subsequent requests using the `Authorization` header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### Token Expiration
- Tokens expire after 24 hours
- Users need to login again to get a new token

---

## Data Models

### User Model
```javascript
{
  id: Number,
  email: String,
  password: String (hashed with bcrypt),
  name: String,
  role: String ('attendee' or 'organizer'),
  createdAt: String (ISO 8601),
  registeredEvents: Array<Number> (event IDs)
}
```

### Event Model
```javascript
{
  id: Number,
  name: String,
  description: String,
  date: String (YYYY-MM-DD format),
  time: String (HH:MM format),
  location: String,
  maxParticipants: Number (null for unlimited),
  organizerId: Number,
  organizer: String (organizer name),
  participants: Array<Number> (user IDs),
  createdAt: String (ISO 8601),
  updatedAt: String (ISO 8601)
}
```

---

## Features

### ✅ Implemented Features
1. **User Authentication**
   - Secure password hashing with bcryptjs
   - JWT-based session management
   - Token expiration (24 hours)
   - Role-based access control (organizer/attendee)

2. **Event Management**
   - Create, read, update, and delete events
   - Event capacity management
   - Event scheduling with date and time validation
   - Organizer-only access control

3. **Participant Management**
   - User event registration
   - Duplicate registration prevention
   - Capacity limit enforcement
   - Participant list tracking

4. **Email Notifications**
   - Registration confirmation emails
   - Event registration confirmation emails
   - Asynchronous email processing

5. **Data Validation**
   - Email format validation
   - Password strength requirements
   - Date and time format validation
   - Input sanitization

6. **In-Memory Storage**
   - Fast data access
   - No database overhead
   - Suitable for development and testing

---

## Error Handling

The API uses standard HTTP status codes:
- **200 OK** - Successful GET request
- **201 Created** - Successful POST/PUT request creating a resource
- **400 Bad Request** - Invalid input or missing required fields
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - Authenticated but insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists (e.g., email already registered)
- **500 Internal Server Error** - Server error

---

## Email Configuration

The system uses Mailtrap for email testing. To configure:

1. Create a free account at https://mailtrap.io
2. Get your SMTP credentials
3. Update the `.env` file with your credentials

For production, use a real email service like:
- SendGrid
- AWS SES
- Gmail
- Any SMTP-compatible service

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| JWT_SECRET | Secret key for JWT signing | - |
| NODE_ENV | Application environment | development |
| EMAIL_HOST | SMTP server host | smtp.mailtrap.io |
| EMAIL_PORT | SMTP server port | 465 |
| EMAIL_USER | SMTP username | - |
| EMAIL_PASS | SMTP password | - |
| EMAIL_FROM | Sender email address | noreply@virtualeventplatform.com |

---

## Future Enhancements

1. **Database Integration** - Replace in-memory storage with MongoDB, PostgreSQL, etc.
2. **Email Verification** - Verify email addresses before account activation
3. **Event Categories** - Categorize events by type
4. **User Profiles** - Extended user information and preferences
5. **Event Search & Filtering** - Advanced search capabilities
6. **Rate Limiting** - Prevent API abuse
7. **Logging & Monitoring** - Comprehensive logging system
8. **Unit & Integration Tests** - Test suite for reliability
9. **API Documentation UI** - Swagger/OpenAPI integration
10. **Event Analytics** - Attendance tracking and analytics

---

## Troubleshooting

### Email not sending
- Check Mailtrap credentials in `.env`
- Ensure EMAIL_HOST and EMAIL_PORT are correct
- Check server logs for errors

### JWT token invalid
- Ensure token is included in Authorization header
- Check token expiration (24 hours)
- Verify JWT_SECRET is consistent

### Event creation fails
- Ensure you're logged in as an organizer
- Check date/time format (YYYY-MM-DD and HH:MM)
- Ensure date is in the future

---

## License
ISC

## Support
For issues or questions, please contact the development team.
