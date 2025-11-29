@echo off
echo 🚀 Setting up NutriTruth Application...
echo.

echo 📦 Installing root dependencies...
npm install

echo.
echo 📦 Installing backend dependencies...
cd backend
npm install

echo.
echo 📦 Installing frontend dependencies...
cd ../frontend
npm install

echo.
echo ✅ Setup complete!
echo.
echo To start the application:
echo   - Development: npm run dev
echo   - Backend only: npm run start-backend
echo   - Frontend only: npm run start-frontend
echo.
pause
