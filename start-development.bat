@echo off
echo Starting NutriTruth Development Environment...
echo.

echo Starting Backend Server...
start "NutriTruth Backend" cmd /k "cd backend && node server.js"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
start "NutriTruth Frontend" cmd /k "cd frontend && npx serve -l 8000"

echo.
echo ✅ Development servers started!
echo.
echo Frontend: http://localhost:8000
echo Backend:  http://localhost:3000
echo.
pause
