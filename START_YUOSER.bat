@echo off
echo ===================================================
echo     YUOSER NXI - SaaS Platform Bootstrapper
echo ===================================================
echo.
echo Starting Database, Backend API, and Next.js Frontend...
echo.

cd /d "%~dp0"

echo 1. Checking Node modules...
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

echo.
echo 2. Booting up Yuoser Full Stack Environment...
echo - API Server: http://localhost:5000
echo - Web App: http://localhost:3000
echo - Super Admin: http://localhost:3000/admin
echo.
echo Press Ctrl+C at any time to stop the servers.
echo ===================================================

call npm run dev
