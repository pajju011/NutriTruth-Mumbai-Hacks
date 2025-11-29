@echo off
echo Starting NutriTruth Backend Server...
echo.

cd backend

echo Checking Node.js...
node --version

echo.
echo Installing dependencies...
npm install

echo.
echo Starting server...
node server.js

pause
