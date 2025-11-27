@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Fix Backend Deployment
echo ========================================
echo.
echo Changes made:
echo 1. Added api/index.js for Vercel Serverless
echo 2. Updated vercel.json configuration
echo 3. Modified index.ts to support Vercel environment
echo.
echo ========================================
echo   Committing changes...
echo ========================================
echo.

git add apps\server\api\
git add apps\server\vercel.json
git add apps\server\src\index.ts
git add apps\web\.env.production

git commit -m "fix: configure backend for Vercel and update frontend API URL"

echo.
echo ========================================
echo   Pushing to GitHub...
echo ========================================
echo.

git push origin main

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo Vercel will automatically redeploy your backend.
echo Wait 1-2 minutes, then test:
echo   https://cosmetic-ve-server.vercel.app/health
echo.
echo Expected response:
echo   {"status":"ok","timestamp":"..."}
echo.
pause
