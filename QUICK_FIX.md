# Quick Fix Guide - Get NutriTruth Running in 5 Minutes

## Step 1: Install Dependencies (1 minute)

```bash
# Run the setup script
setup.bat

# OR manually:
cd backend
npm install
cd ..
```

## Step 2: Start the Application (1 minute)

```bash
# Option A: Use the batch file (Windows)
start-development.bat

# Option B: Manual start
# Terminal 1:
cd backend
npm start

# Terminal 2 (new terminal):
npm start
```

## Step 3: Open in Browser (30 seconds)

```
http://localhost:8000
```

## Step 4: Login (30 seconds)

The Google login button should work automatically. If it doesn't:

1. Press F12 to open browser console
2. Type: `window.emergencyLogin()`
3. Press Enter

You'll be logged in immediately!

## Step 5: Test the App (2 minutes)

### Set Your Allergies

1. After login, you'll see the allergy selection page
2. Click on any allergies you want to track
3. Click "Continue to Dashboard"

### Try a Demo Scan

Since the Google Vision API key has been removed for security, use the demo:

```
http://localhost:8000/result-demo.html
```

This shows a complete product analysis with all features working.

## Common Issues

### Backend Won't Start

```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# If yes, kill the process or change port in backend/server.js
```

### Login Button Not Working

```javascript
// Open browser console (F12) and run:
window.emergencyLogin();
```

### Can't Upload Images

The app needs a Google Vision API key for image analysis. For now:

1. Use the demo result page: `result-demo.html`
2. Or add your own API key in backend/.env

### Database Errors

```bash
cd backend
del nutritruth.db
npm start
# Database will be recreated
```

## What's Working

✅ User authentication (simplified for development)
✅ Allergy profile setup
✅ Dashboard interface
✅ Image upload UI
✅ Barcode scanning UI
✅ Result page with charts and analysis
✅ Scan history
✅ Backend API with SQLite database

## What Needs Setup

⚠️ Google Vision API (for OCR and barcode detection)
⚠️ Google OAuth (for production login)
⚠️ n8n workflows (optional, for advanced features)

## Next Steps

1. **For Testing:** Use `result-demo.html` to see all features
2. **For Development:** Add API keys to `backend/.env`
3. **For Production:** See `PROFESSIONAL_SETUP.md`

## Need Help?

Check `TROUBLESHOOTING.md` for detailed solutions to common problems.

## Quick Commands Reference

```bash
# Start everything
start-development.bat

# Start backend only
cd backend
npm start

# Start frontend only
npm start

# Clear all data
# In browser console:
window.NutriTruth.clearAllData()

# Emergency login
# In browser console:
window.emergencyLogin()

# View demo result
http://localhost:8000/result-demo.html
```

That's it! You should now have NutriTruth running locally. 🎉
