@echo off
echo ========================================
echo NutriTruth Setup Verification
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed
node --version
echo.

echo [2/5] Checking backend dependencies...
cd backend
if not exist "node_modules" (
    echo [WARNING] Backend dependencies not installed
    echo Installing now...
    call npm install
) else (
    echo [OK] Backend dependencies installed
)
cd ..
echo.

echo [3/5] Checking frontend dependencies...
if not exist "node_modules" (
    echo [INFO] Frontend dependencies not required (using serve)
    echo Installing serve globally...
    call npm install -g serve
) else (
    echo [OK] Frontend ready
)
echo.

echo [4/5] Checking required files...
if not exist "frontend\images\logo.svg" (
    echo [ERROR] Logo file missing!
) else (
    echo [OK] Logo file exists
)

if not exist "backend\server.js" (
    echo [ERROR] Backend server file missing!
) else (
    echo [OK] Backend server file exists
)

if not exist "frontend\index.html" (
    echo [ERROR] Frontend index file missing!
) else (
    echo [OK] Frontend index file exists
)
echo.

echo [5/5] Checking ports...
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 3000 is already in use
    echo You may need to kill the process or change the port
) else (
    echo [OK] Port 3000 is available
)

netstat -ano | findstr :8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 8000 is already in use
    echo You may need to kill the process or change the port
) else (
    echo [OK] Port 8000 is available
)
echo.

echo ========================================
echo Verification Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: start-development.bat
echo 2. Open: http://localhost:8000
echo 3. If login fails, press F12 and type: window.emergencyLogin()
echo.
echo For help, see:
echo - QUICK_FIX.md (5-minute setup)
echo - TROUBLESHOOTING.md (detailed help)
echo.
pause
