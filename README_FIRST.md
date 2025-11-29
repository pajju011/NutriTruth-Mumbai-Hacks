# 🚀 START HERE - NutriTruth Quick Setup

## Welcome! 👋

This is your **5-minute quick start guide** to get NutriTruth running.

---

## ⚡ Super Quick Start

```bash
# Step 1: Verify setup
verify-setup.bat

# Step 2: Start everything
start-development.bat

# Step 3: Open browser
http://localhost:8000
```

**That's it!** 🎉

---

## 🔧 If Something Goes Wrong

### Login Button Not Working?

Press `F12` in your browser, then type:

```javascript
window.emergencyLogin();
```

### Backend Won't Start?

```bash
cd backend
npm install
npm start
```

### Want to See a Demo?

Open: `http://localhost:8000/result-demo.html`

---

## 📚 Documentation Guide

Choose the right guide for your needs:

| Document                  | When to Use                  |
| ------------------------- | ---------------------------- |
| **QUICK_FIX.md**          | First time setup (5 minutes) |
| **TROUBLESHOOTING.md**    | Something's not working      |
| **README.md**             | Learn about the project      |
| **PROFESSIONAL_SETUP.md** | Production deployment        |
| **FIXES_APPLIED.md**      | See what was fixed           |

---

## ✅ What Works Out of the Box

- ✅ User authentication (simplified for dev)
- ✅ Allergy profile setup
- ✅ Dashboard interface
- ✅ Image upload UI
- ✅ Result page with charts
- ✅ Backend API with database
- ✅ Demo data for testing

---

## ⚠️ What Needs Setup (Optional)

- ⚠️ Google Vision API (for real OCR)
- ⚠️ Google OAuth (for production login)
- ⚠️ n8n workflows (for advanced features)

**For testing, you don't need these!** Use the demo data instead.

---

## 🎯 Quick Commands

```bash
# Verify everything is set up
verify-setup.bat

# Start development environment
start-development.bat

# Start backend only
cd backend
npm start

# Start frontend only
npm start

# Clear all data (in browser console)
window.NutriTruth.clearAllData()

# Force login (in browser console)
window.emergencyLogin()

# Load demo data (in browser console)
window.NutriTruthResult.loadDemoData()
```

---

## 🆘 Need Help?

1. **Quick issues?** → Check `QUICK_FIX.md`
2. **Detailed help?** → Check `TROUBLESHOOTING.md`
3. **Still stuck?** → Check browser console (F12) for errors

---

## 🎨 Features to Try

1. **Login** - Use emergency login if needed
2. **Set Allergies** - Choose your dietary restrictions
3. **View Dashboard** - See the main interface
4. **Demo Result** - Open `result-demo.html` to see analysis
5. **Scan History** - View your past scans

---

## 🔐 Security Note

⚠️ **Important:** API keys have been removed from the frontend for security. To use real OCR/barcode features:

1. Copy `backend/.env.example` to `backend/.env`
2. Add your API keys
3. Restart the backend

For testing, use the demo data - no API keys needed!

---

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

---

## 🎉 You're Ready!

Run `verify-setup.bat` to check everything, then `start-development.bat` to begin!

**Happy coding!** 🚀

---

_For more details, see the full README.md_
