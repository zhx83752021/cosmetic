# Monitor Vercel deployment and test endpoints
$backendUrl = "https://cosmetic-ve-server.vercel.app"
$frontendUrl = "https://cosmetic-ve.vercel.app"
$maxAttempts = 30
$delaySeconds = 10

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Monitoring Vercel Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  $backendUrl" -ForegroundColor Gray
Write-Host "Frontend: $frontendUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "Waiting for backend to be ready..." -ForegroundColor Yellow
Write-Host "(This may take 1-3 minutes)" -ForegroundColor Gray
Write-Host ""

$attempt = 0
$success = $false

while ($attempt -lt $maxAttempts -and -not $success) {
    $attempt++
    Write-Host "[$attempt/$maxAttempts] Testing backend health..." -NoNewline

    try {
        $response = Invoke-WebRequest -Uri "$backendUrl/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host " [OK]" -ForegroundColor Green
            Write-Host ""
            Write-Host "Response: $($response.Content)" -ForegroundColor Gray
            $success = $true
        }
    } catch {
        Write-Host " [WAITING]" -ForegroundColor Yellow
        if ($attempt -lt $maxAttempts) {
            Start-Sleep -Seconds $delaySeconds
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($success) {
    Write-Host ""
    Write-Host "Backend is ONLINE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testing API endpoints:" -ForegroundColor Yellow
    Write-Host ""

    # Test API base
    Write-Host "1. Testing API base..." -NoNewline
    try {
        $apiResponse = Invoke-WebRequest -Uri "$backendUrl/api" -UseBasicParsing -TimeoutSec 5
        Write-Host " [OK]" -ForegroundColor Green
    } catch {
        Write-Host " [EXPECTED - Root endpoint]" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Frontend will auto-redeploy (wait another 1-2 mins)"
    Write-Host "2. Then visit: $frontendUrl/admin/login"
    Write-Host "3. Login with:"
    Write-Host "   Username: admin"
    Write-Host "   Password: 123456"
    Write-Host ""
    Write-Host "If login still fails, you may need to initialize the database."
    Write-Host "See: VERCEL_DATABASE_SETUP.md"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Backend deployment is taking longer than expected" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. Vercel Dashboard: https://vercel.com/dashboard"
    Write-Host "2. Find 'cosmetic-ve-server' project"
    Write-Host "3. Check deployment logs for errors"
    Write-Host ""
    Write-Host "Common issues:"
    Write-Host "- Build errors (check build logs)"
    Write-Host "- Environment variables missing"
    Write-Host "- Database connection issues"
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
