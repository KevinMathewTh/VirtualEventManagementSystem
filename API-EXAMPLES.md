# Virtual Event Platform - API Examples

This file contains example cURL commands for all API endpoints.
Replace placeholders like `YOUR_TOKEN`, `EVENT_ID`, etc. with actual values.

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. Register User (Organizer)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123",
    "name": "Jane Smith",
    "role": "organizer"
  }'
```

**Expected Response (201 Created):**
```json
{
  "message": "User registered successfully. Check your email for confirmation.",
  "user": {
    "id": 1,
    "email": "jane@example.com",
    "name": "Jane Smith",
    "role": "organizer"
  }
}
```

---

### 2. Register User (Attendee)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "attendee"
  }'
```

**Expected Response (201 Created):**
```json
{
  "message": "User registered successfully. Check your email for confirmation.",
  "user": {
    "id": 2,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "attendee"
  }
}
```

---

### 3. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqYW5lQGV4YW1wbGUuY29tIiwicm9sZSI6Im9yZ2FuaXplciIsIm5hbWUiOiJKYW5lIFNtaXRoIiwiaWF0IjoxNzAwNDcyNzAyLCJleHAiOjE3MDA1NTkxMDJ9.xxx",
  "user": {
    "id": 1,
    "email": "jane@example.com",
    "name": "Jane Smith",
    "role": "organizer"
  }
}
```

> **Save the token** - You'll need it for subsequent requests!

---

## Event Management Endpoints

### 4. Get All Events (No Authentication Required)
```bash
curl -X GET http://localhost:5000/api/events
```

**Expected Response (200 OK):**
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
      "participants": [2],
      "participantCount": 1,
      "createdAt": "2025-11-26T10:30:00.000Z",
      "updatedAt": "2025-11-26T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

### 5. Get Event by ID
```bash
curl -X GET http://localhost:5000/api/events/1
```

**Expected Response (200 OK):**
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
    "participants": [2],
    "participantCount": 1,
    "createdAt": "2025-11-26T10:30:00.000Z",
    "updatedAt": "2025-11-26T10:30:00.000Z"
  }
}
```

---

### 6. Create Event (Organizers Only)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Web Development Workshop",
    "description": "Learn modern web development with React and Node.js",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Online",
    "maxParticipants": 100
  }'
```

**Requirements:**
- Token must be from an organizer user
- Date must be in `YYYY-MM-DD` format and in the future
- Time must be in `HH:MM` format (24-hour)

**Expected Response (201 Created):**
```json
{
  "message": "Event created successfully",
  "event": {
    "id": 1,
    "name": "Web Development Workshop",
    "description": "Learn modern web development with React and Node.js",
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

---

### 7. Update Event (Event Organizer Only)
```bash
curl -X PUT http://localhost:5000/api/events/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Advanced Web Development Workshop",
    "description": "Learn advanced React patterns and best practices",
    "maxParticipants": 75
  }'
```

**Requirements:**
- You must be the event organizer
- Token must be from an organizer user
- All fields are optional (only provide fields you want to update)

**Expected Response (200 OK):**
```json
{
  "message": "Event updated successfully",
  "event": {
    "id": 1,
    "name": "Advanced Web Development Workshop",
    "description": "Learn advanced React patterns and best practices",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Online",
    "maxParticipants": 75,
    "organizerId": 1,
    "organizer": "Jane Smith",
    "participants": [2],
    "participantCount": 1,
    "createdAt": "2025-11-26T10:30:00.000Z",
    "updatedAt": "2025-11-26T10:35:00.000Z"
  }
}
```

---

### 8. Delete Event (Event Organizer Only)
```bash
curl -X DELETE http://localhost:5000/api/events/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Requirements:**
- You must be the event organizer
- Token must be from an organizer user

**Expected Response (200 OK):**
```json
{
  "message": "Event deleted successfully",
  "deletedEvent": {
    "id": 1,
    "name": "Advanced Web Development Workshop",
    "description": "Learn advanced React patterns and best practices",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Online",
    "maxParticipants": 75,
    "organizerId": 1,
    "organizer": "Jane Smith",
    "participants": [2],
    "participantCount": 1,
    "createdAt": "2025-11-26T10:30:00.000Z",
    "updatedAt": "2025-11-26T10:35:00.000Z"
  }
}
```

---

## Participant Management

### 9. Register for Event
```bash
curl -X POST http://localhost:5000/api/events/1/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Requirements:**
- Token must be from a logged-in user
- User must not already be registered for the event
- Event must not be at maximum capacity

**Expected Response (201 Created):**
```json
{
  "message": "Successfully registered for event. Confirmation email sent.",
  "event": {
    "id": 1,
    "name": "Web Development Workshop",
    "description": "Learn modern web development with React and Node.js",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Online",
    "maxParticipants": 100,
    "organizerId": 1,
    "organizer": "Jane Smith",
    "participants": [2, 3],
    "participantCount": 2,
    "createdAt": "2025-11-26T10:30:00.000Z",
    "updatedAt": "2025-11-26T10:40:00.000Z"
  }
}
```

---

## Health Check

### 10. Health Check Endpoint
```bash
curl -X GET http://localhost:5000/api/health
```

**Expected Response (200 OK):**
```json
{
  "message": "Virtual Event Platform API is running",
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

---

## Error Examples

### Invalid Token
```bash
curl -X GET http://localhost:5000/api/events/1 \
  -H "Authorization: Bearer invalid_token_here"
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

---

### Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Response (400 Bad Request):**
```json
{
  "message": "Email, password, and name are required"
}
```

---

### Email Already Registered
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123",
    "name": "Another Jane",
    "role": "attendee"
  }'
```

**Response (409 Conflict):**
```json
{
  "message": "Email already registered"
}
```

---

### Invalid Date Format
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Event",
    "date": "invalid-date",
    "time": "14:00",
    "location": "Online"
  }'
```

**Response (400 Bad Request):**
```json
{
  "message": "Event date must be a valid future date"
}
```

---

### Unauthorized - Only Organizers Can Create Events
```bash
# Using attendee token to create an event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ATTENDEE_TOKEN" \
  -d '{
    "name": "Event",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Online"
  }'
```

**Response (403 Forbidden):**
```json
{
  "message": "Only organizers can perform this action"
}
```

---

### Event Already at Capacity
```bash
# Trying to register when event is full
curl -X POST http://localhost:5000/api/events/1/register \
  -H "Authorization: Bearer USER_TOKEN"
```

**Response (400 Bad Request):**
```json
{
  "message": "Event is at maximum capacity"
}
```

---

### Already Registered for Event
```bash
# Trying to register again
curl -X POST http://localhost:5000/api/events/1/register \
  -H "Authorization: Bearer USER_TOKEN"
```

**Response (400 Bad Request):**
```json
{
  "message": "User is already registered for this event"
}
```

---

## Tips for Using These Examples

1. **Copy/Paste:** You can copy any of these examples directly into your terminal
2. **Replace Tokens:** Replace `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your actual JWT token
3. **Replace IDs:** Replace event IDs and other parameters with actual values from your responses
4. **Pretty Print:** Add `| jq` at the end to format JSON nicely (requires jq installation)
5. **Save Output:** Use `> response.json` to save responses to a file

Example with pretty printing:
```bash
curl -X GET http://localhost:5000/api/events | jq .
```

---

## Complete Workflow

Here's a complete workflow to get you started:

```bash
# 1. Register as organizer
ORGANIZER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "password123",
    "name": "Jane Smith",
    "role": "organizer"
  }')

# 2. Login as organizer
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "password123"
  }')

# Extract token (requires jq)
ORGANIZER_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "Token: $ORGANIZER_TOKEN"

# 3. Create an event
curl -s -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" \
  -d '{
    "name": "Python Bootcamp",
    "description": "Learn Python from scratch",
    "date": "2025-12-20",
    "time": "10:00",
    "location": "Online",
    "maxParticipants": 50
  }' | jq .

# 4. Get all events
curl -s http://localhost:5000/api/events | jq .
```

---

For more detailed information, see README.md
