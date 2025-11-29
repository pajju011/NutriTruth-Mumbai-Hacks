@echo off
echo Starting NutriTruth Frontend...
echo.

cd frontend

echo Installing dependencies...
npm install

echo.
echo Starting frontend server on http://localhost:8000...
npx serve -l 8000

pause
