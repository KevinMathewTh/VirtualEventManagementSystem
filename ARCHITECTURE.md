# Architecture & Code Walkthrough

## System Architecture Overview

This Virtual Event Management Platform is built with a layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser/Postman)              │
└────────────────────────┬──────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                        │
│  (routes/server.js - Port 5000)                            │
└──────────────────┬──────────────────────┬──────────────────┘
                   │                      │
        ┌──────────▼──────────┐  ┌───────▼────────────┐
        │ Authentication     │  │ Event Management   │
        │ Routes (routes/)   │  │ Routes (routes/)   │
        │ - /register        │  │ - /events          │
        │ - /login           │  │ - /events/:id      │
        └──────────┬─────────┘  └────────┬───────────┘
                   │                     │
        ┌──────────▼──────────┐  ┌───────▼────────────┐
        │   Middleware        │  │   Utilities        │
        │ (middleware/auth.js)│  │ (utils/)           │
        │ - JWT Verification  │  │ - Validators       │
        │ - Authorization     │  │ - Email Service    │
        │ - Role Checking     │  │ - Database         │
        └──────────┬─────────┘  └────────┬───────────┘
                   │                     │
        ┌──────────────────────┬─────────────────────┐
        │                      │                    │
        ▼                      ▼                    ▼
   ┌─────────────────────────────────────────────────────┐
   │  In-Memory Data Storage (utils/database.js)        │
   │  ┌─────────────┐              ┌─────────────────┐ │
   │  │ Users Array │              │ Events Array    │ │
   │  │             │              │                 │ │
   │  │ - id        │              │ - id            │ │
   │  │ - email     │              │ - name          │ │
   │  │ - password  │              │ - date          │ │
   │  │ - name      │              │ - time          │ │
   │  │ - role      │              │ - participants  │ │
   │  │ - events    │              │ - organizerId   │ │
   │  └─────────────┘              └─────────────────┘ │
   └─────────────────────────────────────────────────────┘
        │
        ▼
   ┌─────────────────────────────────────────────────────┐
   │  External Services                                  │
   │  ┌────────────────────────────────────────────────┐ │
   │  │ Email Service (Nodemailer/Mailtrap)            │ │
   │  │ - Registration confirmation                    │ │
   │  │ - Event registration confirmation              │ │
   │  └────────────────────────────────────────────────┘ │
   └─────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend Framework
- **Express.js** - Lightweight Node.js web framework

### Authentication & Security
- **bcryptjs** - Password hashing and verification
- **jsonwebtoken (JWT)** - Token-based authentication

### Email
- **nodemailer** - Email sending library
- **Mailtrap** (or any SMTP) - Email service provider

### Configuration
- **dotenv** - Environment variable management

### Data Storage
- **In-Memory Arrays/Objects** - Fast, development-friendly storage

---

## Project Structure Breakdown

### 1. Root Files

#### `server.js` - Main Entry Point
```javascript
// Initializes Express app
// Loads environment variables from .env
// Mounts routes and middleware
// Starts listening on configured PORT
```

**Key responsibilities:**
- Load and validate environment variables
- Create Express application instance
- Register middleware (JSON parsing, logging)
- Mount authentication and event routes
- Start HTTP server

#### `.env` - Configuration
```
PORT - Server port number
JWT_SECRET - Secret key for signing JWT tokens
NODE_ENV - Environment (development/production)
EMAIL_* - SMTP configuration for email
```

---

### 2. Middleware (`middleware/auth.js`)

Purpose: Protect routes and verify user permissions

#### `verifyToken(req, res, next)`
```javascript
// Extracts JWT token from Authorization header
// Verifies token signature and expiration
// Attaches decoded user data to req.user
// Rejects with 401 if invalid/expired
```

Usage:
```javascript
router.post('/create', verifyToken, (req, res) => {
  // req.user contains: { id, email, role, name }
});
```

#### `verifyOrganizer(req, res, next)`
```javascript
// Checks if req.user.role === 'organizer'
// Rejects with 403 if user is not an organizer
// Must be used after verifyToken
```

Usage:
```javascript
router.post('/events', verifyToken, verifyOrganizer, (req, res) => {
  // Only organizers can reach here
});
```

---

### 3. Routes

#### `routes/auth.js` - Authentication Routes

**POST /api/auth/register**
```javascript
// 1. Validate input (email, password, name required)
// 2. Check email format
// 3. Check password strength (min 6 chars)
// 4. Check if email already exists
// 5. Hash password with bcrypt (salt rounds: 10)
// 6. Create user object
// 7. Store in users array
// 8. Send registration email (async)
// 9. Return 201 with user data
```

**POST /api/auth/login**
```javascript
// 1. Validate input (email, password required)
// 2. Find user by email
// 3. Compare provided password with hashed password using bcrypt
// 4. Generate JWT token (payload: id, email, role, name)
// 5. Set token expiration to 24 hours
// 6. Return token to client
// 7. Client stores token for authenticated requests
```

#### `routes/events.js` - Event Management Routes

**GET /api/events**
- Returns all events with participant count
- No authentication required
- Can be paginated in future

**GET /api/events/:id**
- Returns single event by ID
- No authentication required
- Returns 404 if not found

**POST /api/events** (Organizers Only)
```javascript
// 1. Verify user is organizer (via middleware)
// 2. Validate event data (name, date, time required)
// 3. Validate date is in future
// 4. Validate time format (HH:MM)
// 5. Create event object with:
//    - Auto-generated ID
//    - Organizer info from JWT token
//    - Empty participants array
//    - Timestamps
// 6. Store in events array
// 7. Return 201 with event data
```

**PUT /api/events/:id** (Event Organizer Only)
```javascript
// 1. Find event by ID
// 2. Verify current user is event organizer
// 3. Validate new data (all optional)
// 4. Update only provided fields
// 5. Update timestamp
// 6. Return 200 with updated event
```

**DELETE /api/events/:id** (Event Organizer Only)
```javascript
// 1. Find event by ID
// 2. Verify current user is event organizer
// 3. Remove event from array
// 4. Return 200 with deleted event data
```

**POST /api/events/:id/register** (Authenticated Users)
```javascript
// 1. Find event by ID
// 2. Find user by ID from JWT
// 3. Check if user already registered (prevents duplicates)
// 4. Check if event at max capacity
// 5. Add user ID to event.participants array
// 6. Add event ID to user.registeredEvents array
// 7. Send confirmation email asynchronously
// 8. Return 201 with updated event
```

---

### 4. Utilities (`utils/`)

#### `database.js` - In-Memory Data Storage
```javascript
// Two main arrays:
let users = [];      // Stores user objects
let events = [];     // Stores event objects

// Counters for auto-incrementing IDs
let userIdCounter = 1;
let eventIdCounter = 1;

// Functions:
// getNextUserId() - Returns next available user ID
// getNextEventId() - Returns next available event ID
// resetCounters() - For testing purposes
```

**Data Structures:**

User Object:
```javascript
{
  id: 1,
  email: "user@example.com",
  password: "$2a$10$...(hashed)",
  name: "John Doe",
  role: "attendee" or "organizer",
  createdAt: "2025-11-26T10:30:00.000Z",
  registeredEvents: [1, 2, 3]  // event IDs
}
```

Event Object:
```javascript
{
  id: 1,
  name: "Event Name",
  description: "Event description",
  date: "2025-12-15",        // YYYY-MM-DD
  time: "14:00",             // HH:MM 24-hour
  location: "Online",
  maxParticipants: 100 or null,
  organizerId: 1,
  organizer: "Jane Smith",
  participants: [2, 3, 4],   // user IDs
  createdAt: "2025-11-26T10:30:00.000Z",
  updatedAt: "2025-11-26T10:30:00.000Z"
}
```

#### `emailService.js` - Email Notifications
```javascript
// Uses nodemailer for sending emails
// Configured with SMTP from .env

sendRegistrationEmail(userEmail, userName)
// Sends welcome email to new users
// Called async after registration

sendEventRegistrationEmail(userEmail, userName, eventName)
// Sends confirmation email when user registers for event
// Called async after event registration
```

#### `validators.js` - Input Validation
```javascript
isValidEmail(email)
// Checks email format: user@domain.com

isValidPassword(password)
// Requires minimum 6 characters

isValidDate(dateString)
// Must be YYYY-MM-DD format
// Must be a future date

isValidTime(timeString)
// Must be HH:MM format (24-hour)
// Example: 14:30, 09:00
```

---

## Request-Response Flow Example

### Complete User Registration & Event Creation Flow

```
┌─ Client ──────────────────────────────────────────────────────┐
│                                                                 │
│ 1. POST /auth/register (email, password, name, role)          │
│    │                                                            │
│    ▼                                                            │
│    Server receives request → Validates input                   │
│    │                                                            │
│    ├─ Check required fields                                    │
│    ├─ Validate email format                                    │
│    ├─ Hash password with bcrypt                                │
│    ├─ Create user object                                       │
│    ├─ Store in users array                                     │
│    └─ Send confirmation email (async, doesn't block)           │
│    │                                                            │
│    ◄─ 201 Created + user data                                 │
│                                                                 │
│ 2. POST /auth/login (email, password)                          │
│    │                                                            │
│    ▼                                                            │
│    Server receives request → Authenticates                     │
│    │                                                            │
│    ├─ Find user by email                                       │
│    ├─ Compare password with bcrypt.compare()                   │
│    ├─ Generate JWT token                                       │
│    │  (payload: id, email, role, name, exp: now + 24h)        │
│    └─ Sign token with JWT_SECRET                               │
│    │                                                            │
│    ◄─ 200 OK + token + user data                              │
│                                                                 │
│ 3. POST /events (name, date, time, ...)                        │
│    Header: Authorization: Bearer <JWT_TOKEN>                  │
│    │                                                            │
│    ▼                                                            │
│    Server receives request → Checks middleware                 │
│    │                                                            │
│    ├─ verifyToken middleware:                                  │
│    │  ├─ Extract token from header                             │
│    │  ├─ Verify signature with JWT_SECRET                      │
│    │  ├─ Check expiration                                      │
│    │  └─ Attach decoded user to req.user                       │
│    │                                                            │
│    ├─ verifyOrganizer middleware:                              │
│    │  └─ Check req.user.role === 'organizer'                   │
│    │                                                            │
│    ├─ Route handler:                                           │
│    │  ├─ Validate event data                                   │
│    │  ├─ Create event object                                   │
│    │  ├─ Set organizerId from req.user.id                      │
│    │  └─ Store in events array                                 │
│    │                                                            │
│    ◄─ 201 Created + event data                                │
│                                                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Security Features

### 1. Password Hashing
- Uses bcryptjs with 10 salt rounds
- Passwords are never stored in plain text
- Each password is unique even for same input

### 2. JWT Authentication
- Tokens are signed with JWT_SECRET
- Tokens expire after 24 hours
- Invalid/expired tokens are rejected with 401

### 3. Authorization Checks
- Middleware verifies user roles
- Only organizers can create/modify events
- Users can't perform unauthorized actions

### 4. Input Validation
- All inputs validated before processing
- Email format checked
- Password strength enforced (min 6 chars)
- Date/time format validated

### 5. Error Handling
- Specific error messages for debugging
- Proper HTTP status codes
- No sensitive data exposed in errors

---

## Data Flow Examples

### Authentication Flow
```
User → Register → Validate → Hash Password → Store User
         ↓
User → Login → Validate → Compare Password → Generate JWT Token
         ↓
User → Request with Token → Verify Token → Execute Action
```

### Event Creation Flow
```
Organizer → Create Event → Validate → Create Event Object
              ↓
           Store in Array → Return Event ID
```

### Event Registration Flow
```
User → Register for Event → Check if Already Registered
          ↓
       Check Capacity → Add to Participants Array
          ↓
       Update User's Events → Send Confirmation Email
```

---

## Database Structure (In-Memory)

### Users Array
```javascript
[
  {
    id: 1,
    email: "organizer@example.com",
    password: "$2a$10$...",
    name: "Jane Smith",
    role: "organizer",
    registeredEvents: [1, 2],
    createdAt: "2025-11-26T10:30:00.000Z"
  },
  {
    id: 2,
    email: "attendee@example.com",
    password: "$2a$10$...",
    name: "John Doe",
    role: "attendee",
    registeredEvents: [1],
    createdAt: "2025-11-26T10:35:00.000Z"
  }
]
```

### Events Array
```javascript
[
  {
    id: 1,
    name: "Web Development Workshop",
    description: "Learn React and Node.js",
    date: "2025-12-15",
    time: "14:00",
    location: "Online",
    maxParticipants: 100,
    organizerId: 1,
    organizer: "Jane Smith",
    participants: [2, 3],
    createdAt: "2025-11-26T10:30:00.000Z",
    updatedAt: "2025-11-26T10:30:00.000Z"
  }
]
```

---

## Async Operations

### Email Sending (Non-Blocking)
```javascript
// These don't block the response
sendRegistrationEmail(email, name);  // Returns immediately
sendEventRegistrationEmail(email, name, eventName);  // Returns immediately

// Server responds to client first
// Email is sent in the background
```

### Benefits
- User gets immediate response (no waiting for email)
- Server remains responsive
- Email failures don't crash the server

---

## Error Handling

### Standard Error Responses

```javascript
// 400 Bad Request - Client error
{ "message": "Invalid email format" }

// 401 Unauthorized - Auth required
{ "message": "Access token required" }

// 403 Forbidden - No permission
{ "message": "Only organizers can perform this action" }

// 404 Not Found - Resource missing
{ "message": "Event not found" }

// 409 Conflict - Resource exists
{ "message": "Email already registered" }

// 500 Server Error
{ "message": "Internal server error" }
```

---

## Future Improvements

### Database
- Migrate to MongoDB/PostgreSQL
- Add data persistence
- Implement transactions

### Features
- Email verification
- Event categories
- User profiles with avatar
- Event search and filtering
- Pagination
- User ratings/reviews

### Security
- Rate limiting
- Input sanitization
- CORS configuration
- API key management
- Two-factor authentication

### Operations
- Comprehensive logging
- Error tracking (Sentry)
- Performance monitoring
- API analytics
- Automated testing

### Scalability
- Load balancing
- Caching (Redis)
- Database indexing
- CDN for static files
- API versioning

---

## Testing Checklist

- [ ] User registration works
- [ ] Password hashing verification
- [ ] Login generates valid token
- [ ] Token expires correctly
- [ ] Event creation by organizer
- [ ] Event creation blocked for attendees
- [ ] Event update only by organizer
- [ ] Event deletion only by organizer
- [ ] Event registration works
- [ ] Duplicate registration blocked
- [ ] Capacity limit enforced
- [ ] Emails sent on registration
- [ ] Emails sent on event registration
- [ ] Invalid tokens rejected
- [ ] All error messages clear

---

For more details, see:
- README.md - Full API documentation
- API-EXAMPLES.md - Request/response examples
- QUICK_START.md - Setup and testing guide
