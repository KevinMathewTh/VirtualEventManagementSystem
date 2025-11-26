# Quick Start Guide - Virtual Event Management Platform

## Prerequisites
- Node.js (v14.x or higher) installed
- npm installed
- A terminal/command prompt
- (Optional) Postman or cURL for API testing

## Installation Steps

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages:
- express
- bcryptjs
- jsonwebtoken
- nodemailer
- dotenv
- nodemon (dev dependency)

### Step 2: Configure Environment Variables
Edit the `.env` file in the project root:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development

# Email Configuration (optional for testing)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_pass
EMAIL_FROM=noreply@virtualeventplatform.com
```

> **Note:** For email functionality, sign up for Mailtrap (https://mailtrap.io) - it's free and perfect for development!

### Step 3: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║   Virtual Event Platform API Server        ║
║   Running on http://localhost:5000         ║
║   Environment: development                 ║
╚════════════════════════════════════════════╝
```

## Testing the API

### Option 1: Using cURL (Command Line)

#### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "attendee"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```
> Save the `token` from the response

#### 3. Create Event (as Organizer)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Web Development Workshop",
    "description": "Learn modern web development",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Online",
    "maxParticipants": 100
  }'
```

#### 4. Get All Events
```bash
curl http://localhost:5000/api/events
```

#### 5. Register for Event
```bash
curl -X POST http://localhost:5000/api/events/1/register \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 2: Using Postman

1. Open Postman
2. Click "Import"
3. Select `Postman-Collection.json` from the project folder
4. Set the `base_url` variable to `http://localhost:5000`
5. Set the `auth_token` variable with your JWT token after login
6. Click on any request and click "Send"

### Option 3: Using the Bash Test Script (Linux/Mac)
```bash
bash test-api.sh
```

## Workflow Example

### Step 1: Register as an Organizer
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "password123",
    "name": "Jane Smith",
    "role": "organizer"
  }'
```

### Step 2: Login as Organizer
```bash
# Login and copy the token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "password123"
  }'

# Response includes: "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 3: Create an Event
```bash
# Replace YOUR_TOKEN with the actual token from login
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Python Bootcamp",
    "description": "Learn Python from scratch",
    "date": "2025-12-20",
    "time": "10:00",
    "location": "Online",
    "maxParticipants": 50
  }'

# Response includes: "id": 1
```

### Step 4: Register as an Attendee
```bash
# Register as attendee
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "attendee@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "attendee"
  }'

# Login as attendee
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "attendee@example.com",
    "password": "password123"
  }'

# Copy the attendee token
```

### Step 5: Attendee Registers for Event
```bash
# Replace ATTENDEE_TOKEN with the token from attendee login
curl -X POST http://localhost:5000/api/events/1/register \
  -H "Authorization: Bearer ATTENDEE_TOKEN"
```

## Project Structure

```
VirtualPlatform/
├── middleware/
│   └── auth.js                 # Authentication middleware
├── routes/
│   ├── auth.js                 # Auth endpoints (register, login)
│   └── events.js               # Event endpoints (CRUD, registration)
├── utils/
│   ├── database.js             # In-memory data storage
│   ├── emailService.js         # Email notifications
│   └── validators.js           # Input validation
├── server.js                   # Main server file
├── package.json                # Dependencies
├── .env                        # Configuration
├── .gitignore                  # Git ignore
├── README.md                   # Full documentation
├── QUICK_START.md              # This file
├── test-api.sh                 # Bash test script
└── Postman-Collection.json     # Postman collection
```

## Key Features

✅ **User Authentication**
- Register with email, password, and role
- Secure login with JWT tokens
- Token expires in 24 hours

✅ **Event Management**
- Create, read, update, delete events
- Only organizers can manage events
- Event capacity limits

✅ **Participant Management**
- Users can register for events
- Prevent duplicate registrations
- Track participant count

✅ **Email Notifications**
- Registration confirmation emails
- Event registration confirmations
- Asynchronous processing

## Troubleshooting

### Port already in use
If port 5000 is already in use:
1. Edit `.env` and change `PORT=5000` to another port (e.g., `PORT=3000`)
2. Restart the server

### Module not found error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Email not working
- Check `.env` file for correct SMTP credentials
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Check server console for error messages

### Invalid token error
- Make sure to include `Authorization: Bearer YOUR_TOKEN` header
- Token expires after 24 hours - login again if needed
- Copy the full token from login response

## Next Steps

1. ✅ Explore all API endpoints (see README.md for details)
2. ✅ Test with different user roles (organizer vs attendee)
3. ✅ Create multiple events and register participants
4. ✅ Check email functionality with Mailtrap
5. ✅ Review the code structure and understand the flow

## Additional Resources

- **Full API Documentation:** See `README.md`
- **Express.js Documentation:** https://expressjs.com
- **JWT Documentation:** https://jwt.io
- **bcryptjs Documentation:** https://github.com/dcodeIO/bcrypt.js
- **Nodemailer Documentation:** https://nodemailer.com

## Support

For issues or questions:
1. Check the README.md for detailed API documentation
2. Review error messages in the server console
3. Verify all environment variables are correctly set
4. Ensure Node.js and npm are properly installed

---

**Happy Testing! 🚀**
