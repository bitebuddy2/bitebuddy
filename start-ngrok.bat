@echo off
title ngrok BiteBuddy Tunnel
echo ================================
echo BiteBuddy ngrok Tunnel Starter
echo ================================
echo.
echo Checking if ngrok is available...

where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: ngrok is not found in PATH
    echo Please install ngrok or add it to your PATH
    echo.
    pause
    exit /b 1
)

echo ngrok found! Starting tunnel...
echo.
echo IMPORTANT: Look for the HTTPS URL below
echo Example: https://1234-56-78-90-123.ngrok-free.app
echo.
echo Press Ctrl+C to stop when done
echo ================================
echo.

ngrok http 3000

echo.
echo ngrok has stopped.
echo.
pause