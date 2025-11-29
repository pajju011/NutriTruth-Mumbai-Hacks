# NutriTruth Troubleshooting Guide

## Common Issues and Solutions

### 1. Backend Not Starting

**Problem:** Backend server won't start or crashes immediately

**Solutions:**

```bash
# Check if dependencies are installed
cd backend
npm install

# Check if port 3000 is available
netstat -ano | findstr :3000

# Start backend with error logging
npm start
```

**Common Causes:**

- Missing dependencies → Run `npm install` in backend folder
- Port 3000 already in use → Kill the process or change port in server.js
- Database file permissions → Check nutritruth.db file permissions

### 2. Frontend Can't Connect to Backend

**Problem:** "Cannot connect to backend" error in browser console

**Solutions:**

1. Verify backend is running on http://localhost:3000
2. Check browser console for CORS errors
3. Ensure API_BASE_URL in app.js matches backend URL

**Test Backend:**

```bash
# Open browser and visit:
http://localhost:3000/api/auth/me
# Should return 401 error (expected without token)
```

### 3. Login Not Working

**Problem:** Google login button doesn't work or shows errors

**Current Status:** The app uses a simplified login system for development

**Quick Fix:**

1. Open browser console (F12)
2. Type: `window.emergencyLogin()`
3. Press Enter
4. You'll be logged in immediately

**Proper Solution:**

- The app is configured for local development
- Google OAuth requires proper setup (see GOOGLE_OAUTH_SETUP.md)
- For testing, use the emergency login function

### 4. Image Upload Not Working

**Problem:** Images don't upload or analysis fails

**Solutions:**

**Check 1: File Size**

- Maximum file size: 10MB
- Compress large images before uploading

**Check 2: File Format**

- Supported: JPG, PNG, WEBP
- Not supported: GIF, BMP, TIFF

**Check 3: Backend Upload Folder**

```bash
# Check if uploads folder exists
cd backend
dir uploads

# If missing, create it:
mkdir uploads
```

### 5. Product Analysis Fails

**Problem:** "Failed to analyze image" or "Product not found"

**Current Limitations:**

- Google Vision API key has been removed for security
- Barcode lookup requires Open Food Facts database
- Some products may not be in the database

**Solutions:**

**For OCR (Image Analysis):**

1. The app needs a valid Google Vision API key
2. Add your API key in backend/.env file:

```
GOOGLE_VISION_API_KEY=your_key_here
```

**For Barcode Lookup:**

1. Uses Open Food Facts (free, no key needed)
2. Not all products are in the database
3. Try scanning popular branded products

### 6. Result Page Shows "No Data"

**Problem:** After scanning, result page is blank

**Solution:**

```javascript
// Open browser console and check:
localStorage.getItem("nutritruth_last_scan");

// If null, the scan didn't save properly
// Try scanning again or use demo data:
window.location.href = "result-demo.html";
```

### 7. Database Errors

**Problem:** SQLite errors or "Database locked"

**Solutions:**

```bash
# Delete and recreate database
cd backend
del nutritruth.db
npm start
# Database will be recreated automatically
```

### 8. Port Already in Use

**Problem:** "Port 3000 is already in use"

**Solutions:**

**Option 1: Kill the process**

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Option 2: Change the port**
Edit `backend/server.js`:

```javascript
const PORT = process.env.PORT || 3001; // Changed from 3000
```

Then update `frontend/scripts/app.js`:

```javascript
const API_BASE_URL = "http://localhost:3001/api"; // Changed from 3000
```

### 9. CORS Errors

**Problem:** "CORS policy" errors in browser console

**Solution:**
The backend is already configured for CORS. If you still see errors:

1. Check backend console for CORS logs
2. Verify frontend is running on http://localhost:8000
3. Clear browser cache and reload

### 10. Dependencies Not Installing

**Problem:** npm install fails

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

## Quick Health Check

Run these commands to verify everything is working:

```bash
# 1. Check Node.js version (should be 14+)
node --version

# 2. Check if backend dependencies are installed
cd backend
npm list

# 3. Start backend
npm start
# Should show: "🚀 NutriTruth server running on http://localhost:3000"

# 4. In a new terminal, start frontend
cd ..
npm start
# Should show: "Serving on http://localhost:8000"

# 5. Open browser to http://localhost:8000
```

## Development Mode

For active development:

```bash
# Terminal 1: Backend with auto-reload
cd backend
npm run dev

# Terminal 2: Frontend
cd ..
npm start
```

## Testing Features

### Test Login

```javascript
// In browser console:
window.emergencyLogin();
```

### Test Scan History

```javascript
// In browser console:
localStorage.setItem(
  "nutritruth_recent_scans",
  JSON.stringify([
    {
      productName: "Test Product",
      timestamp: new Date().toISOString(),
      allergenWarnings: ["Soy", "Milk"],
    },
  ])
);
location.reload();
```

### Clear All Data

```javascript
// In browser console:
window.NutriTruth.clearAllData();
```

### View Demo Result

```
http://localhost:8000/result-demo.html
```

## Security Notes

⚠️ **IMPORTANT:** The following have been removed from the codebase for security:

- Google Vision API key (was exposed in frontend)
- Google OAuth client secret (should never be in frontend)

To use these features:

1. Add API keys to backend/.env file
2. Create backend endpoints that use these keys
3. Frontend calls backend, not external APIs directly

## Getting Help

If none of these solutions work:

1. Check browser console (F12) for error messages
2. Check backend terminal for error logs
3. Check the GitHub issues page
4. Provide error messages when asking for help

## Known Limitations

1. **Google Vision API:** Requires valid API key (not included)
2. **Barcode Database:** Limited to Open Food Facts database
3. **Google OAuth:** Requires proper OAuth setup
4. **Image Analysis:** Works best with clear, well-lit images
5. **Product Database:** Not all products are available

## Next Steps

For production deployment, see:

- PROFESSIONAL_SETUP.md - Production deployment guide
- README.md - General project information
