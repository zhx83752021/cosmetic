@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Start Local Development
echo ========================================
echo.
echo Starting backend server...
echo.
start "Backend Server" cmd /k "cd /d e:\site2\apps\server && pnpm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting frontend...
echo.
start "Frontend Dev" cmd /k "cd /d e:\site2\apps\web && pnpm run dev"
echo.
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Open http://localhost:5173/admin/login to test
echo.
echo ========================================
echo.
pause
