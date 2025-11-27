# Test possible backend URLs
$possibleUrls = @(
    "cosmetic-ve-server.vercel.app",
    "cosmetics-api.vercel.app",
    "cosmetic-ve-api.vercel.app",
    "cosmetic-ve-backend.vercel.app",
    "cosmetics-server.vercel.app"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing possible backend URLs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$foundUrl = $null

foreach ($url in $possibleUrls) {
    Write-Host "Testing: https://$url" -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "https://$url/health" -UseBasicParsing -TimeoutSec 5
        Write-Host " [OK]" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Gray
        $foundUrl = $url
        break
    } catch {
        Write-Host " [FAILED]" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($foundUrl) {
    Write-Host ""
    Write-Host "Found backend at: https://$foundUrl" -ForegroundColor Green
    Write-Host "API URL: https://$foundUrl/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update frontend config:" -ForegroundColor White
    Write-Host "   File: apps\web\.env.production"
    Write-Host "   Change to: VITE_API_BASE_URL=https://$foundUrl/api"
    Write-Host ""
    Write-Host "2. Commit and push:" -ForegroundColor White
    Write-Host "   git add apps\web\.env.production"
    Write-Host "   git commit -m 'fix: update production API URL'"
    Write-Host "   git push origin main"
} else {
    Write-Host ""
    Write-Host "No backend found at tested URLs" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please manually check:" -ForegroundColor Yellow
    Write-Host "1. Visit https://vercel.com/dashboard"
    Write-Host "2. Find your backend project"
    Write-Host "3. Copy the domain and test: https://your-domain/health"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
