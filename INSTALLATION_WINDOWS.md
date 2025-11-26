# Installation Guide for Windows - Virtual Event Platform

This guide provides step-by-step instructions for setting up and running the Virtual Event Management Platform on Windows.

## Prerequisites

Before you start, ensure you have the following installed on your Windows machine:

### 1. Node.js and npm
- **Download:** https://nodejs.org (LTS version recommended)
- **Version Check:** Open PowerShell or Command Prompt and run:
  ```powershell
  node --version
  npm --version
  ```
  You should see something like:
  ```
  v18.17.0
  9.6.7
  ```

### 2. Git (Optional but Recommended)
- **Download:** https://git-scm.com/download/win
- **Version Check:**
  ```powershell
  git --version
  ```

### 3. A Code Editor (Optional)
- **VS Code** (Recommended): https://code.visualstudio.com
- **WebStorm**: https://www.jetbrains.com/webstorm/
- Or any text editor of your choice

---

## Installation Steps

### Step 1: Open PowerShell or Command Prompt
1. Press `Win + R`
2. Type `powershell` and press Enter
3. Or search for "Command Prompt" or "PowerShell" in the Start menu

### Step 2: Navigate to Project Directory
```powershell
# Navigate to the project folder
cd "C:\Users\mathe\OneDrive\Desktop\Airtribe\VirtualPlatform"

# Verify you're in the right directory
dir
```

You should see files like `package.json`, `server.js`, `README.md`, etc.

### Step 3: Install Dependencies
```powershell
npm install
```

This will:
- Download all required packages
- Create a `node_modules` folder
- Create a `package-lock.json` file

**Expected output:**
```
added 234 packages, and audited 235 packages in 2m
found 0 vulnerabilities
```

⏱️ This may take 1-5 minutes depending on your internet speed.

### Step 4: Configure Environment Variables
1. Open the `.env` file in the project directory with a text editor
2. Verify the contents:
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
3. Save the file (Ctrl + S)

### Step 5: Start the Server
```powershell
npm start
```

**Expected output:**
```
╔════════════════════════════════════════════╗
║   Virtual Event Platform API Server        ║
║   Running on http://localhost:5000         ║
║   Environment: development                 ║
╚════════════════════════════════════════════╝
```

✅ **Server is now running!**

To stop the server, press `Ctrl + C` in PowerShell.

---

## Development Mode (with Auto-Reload)

For development, you can use `nodemon` which automatically restarts the server when you make changes:

```powershell
npm run dev
```

This is useful when you're actively developing and making changes to the code.

---

## Testing the API

### Option 1: Using PowerShell with curl

Open a **new PowerShell window** (keep the server running in the first one):

#### Health Check
```powershell
curl -Method GET http://localhost:5000/api/health
```

#### Register a User
```powershell
$body = @{
    email = "user@example.com"
    password = "password123"
    name = "John Doe"
    role = "attendee"
} | ConvertTo-Json

curl -Method POST http://localhost:5000/api/auth/register `
  -ContentType "application/json" `
  -Body $body
```

#### Login
```powershell
$body = @{
    email = "user@example.com"
    password = "password123"
} | ConvertTo-Json

curl -Method POST http://localhost:5000/api/auth/login `
  -ContentType "application/json" `
  -Body $body
```

### Option 2: Using Postman (Recommended for Windows)

1. **Download Postman:** https://www.postman.com/downloads/
2. **Install** and open Postman
3. **Import Collection:** File → Import → Select `Postman-Collection.json`
4. **Set Variables:**
   - Click "Collections" on the left
   - Click the three dots next to your collection
   - Select "Edit"
   - Go to "Variables" tab
   - Set `base_url` to `http://localhost:5000`
5. **Test Endpoints:** Click any request and click "Send"

### Option 3: Using VS Code REST Client Extension

1. **Install Extension:** Open VS Code, go to Extensions, search for "REST Client", install by Huachao Mao
2. **Create a file** called `requests.rest` in your project
3. **Add requests** (example):
   ```
   ### Health Check
   GET http://localhost:5000/api/health
   
   ### Register User
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "password123",
     "name": "John Doe",
     "role": "attendee"
   }
   ```
4. **Click "Send Request"** above each request

---

## Troubleshooting

### Problem: "Port 5000 is already in use"

**Solution 1:** Use a different port
1. Open `.env` file
2. Change `PORT=5000` to `PORT=3000` (or any unused port)
3. Save and restart the server

**Solution 2:** Find what's using port 5000
```powershell
# Find the process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the process ID)
taskkill /PID <PID> /F
```

### Problem: "'npm' is not recognized"

**Solution:** Restart PowerShell or Computer
- Close PowerShell completely
- Open a new PowerShell window
- Try again

If still not working, reinstall Node.js from https://nodejs.org

### Problem: "node_modules folder is missing"

**Solution:** Reinstall dependencies
```powershell
npm install
```

### Problem: "Cannot find module" error when starting server

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -Recurse node_modules
rm package-lock.json
npm install
```

### Problem: ".env file not found" or not being read

**Solution:**
1. Verify `.env` file exists in the project root
2. Restart the server
3. Check for typos in the `.env` file

### Problem: Email not sending

**Solution:**
1. Verify SMTP credentials in `.env` are correct
2. Sign up for Mailtrap: https://mailtrap.io
3. Get your credentials from Mailtrap dashboard
4. Update `.env` with correct credentials
5. Restart the server

### Problem: Invalid JWT token errors

**Solution:**
1. Get a new token by logging in again
2. Copy the entire token string
3. Use it in the Authorization header: `Authorization: Bearer YOUR_TOKEN`

---

## Project Structure Overview

```
VirtualPlatform/
├── middleware/
│   └── auth.js                 # JWT verification and authorization
├── routes/
│   ├── auth.js                 # Authentication endpoints
│   └── events.js               # Event management endpoints
├── utils/
│   ├── database.js             # In-memory data storage
│   ├── emailService.js         # Email notifications
│   └── validators.js           # Input validation
├── server.js                   # Main server entry point
├── package.json                # Project dependencies and scripts
├── .env                        # Configuration variables
├── .gitignore                  # Files to ignore in Git
├── README.md                   # Full documentation
├── QUICK_START.md              # Quick start guide
├── API-EXAMPLES.md             # API examples and requests
├── Postman-Collection.json     # Postman API collection
├── test-api.sh                 # Bash test script
└── node_modules/               # Installed packages (auto-created)
```

---

## File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Main server file - starts the Express app |
| `middleware/auth.js` | JWT verification and authorization checks |
| `routes/auth.js` | User registration and login endpoints |
| `routes/events.js` | Event CRUD and registration endpoints |
| `utils/database.js` | In-memory data storage for users and events |
| `utils/emailService.js` | Email sending functionality |
| `utils/validators.js` | Input validation functions |
| `package.json` | Dependencies and npm scripts |
| `.env` | Environment configuration (sensitive data) |
| `README.md` | Full API documentation |
| `QUICK_START.md` | Quick setup and testing guide |
| `API-EXAMPLES.md` | Detailed API request examples |
| `Postman-Collection.json` | Ready-to-import Postman collection |

---

## Quick Commands Reference

```powershell
# Navigate to project
cd "C:\Users\mathe\OneDrive\Desktop\Airtribe\VirtualPlatform"

# Install dependencies
npm install

# Start production server
npm start

# Start development server (with auto-reload)
npm run dev

# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Uninstall and reinstall packages
rm -Recurse node_modules
rm package-lock.json
npm install
```

---

## Testing Workflow

### Step 1: Start the Server
```powershell
npm start
```
Keep this terminal open.

### Step 2: Open Another Terminal
Open a new PowerShell window for testing.

### Step 3: Test Health Check
```powershell
curl -Method GET http://localhost:5000/api/health
```

### Step 4: Register a User
Copy the example from `API-EXAMPLES.md` or use Postman.

### Step 5: Login
Use the registered email and password.

### Step 6: Use the Token
Copy the token from login response and use it for protected endpoints.

---

## Next Steps

1. ✅ Successfully installed the project
2. ✅ Started the server
3. ✅ Tested at least one endpoint
4. 📖 Read `QUICK_START.md` for a quick overview
5. 📖 Read `README.md` for full API documentation
6. 🧪 Test all endpoints using Postman or curl
7. 💻 Review the code and understand the structure
8. 🔧 Make modifications and improvements as needed

---

## Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs/
- **Express.js Guide:** https://expressjs.com/
- **npm Documentation:** https://docs.npmjs.com/
- **bcryptjs:** https://github.com/dcodeIO/bcrypt.js
- **JWT.io:** https://jwt.io/
- **Nodemailer:** https://nodemailer.com/
- **Mailtrap (Email Testing):** https://mailtrap.io/

---

## Support & Help

If you encounter issues:

1. **Check Error Messages:** Read the error message carefully in the server console
2. **Review Logs:** Server logs show what's happening
3. **Check .env:** Verify all configuration is correct
4. **Restart:** Try restarting the server
5. **Reinstall:** Try reinstalling node_modules
6. **Update Node:** Ensure you have the latest Node.js version

---

## Recommended IDE Setup (VS Code)

### Useful Extensions
- **REST Client** - Make HTTP requests directly in VS Code
- **Thunder Client** - Alternative REST client
- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Prettier** - Code formatter
- **ESLint** - Code linting

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

**Happy coding! 🚀**

For detailed API documentation, see `README.md`
For quick examples, see `API-EXAMPLES.md`
For troubleshooting specific features, see `QUICK_START.md`
