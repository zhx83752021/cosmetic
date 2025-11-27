@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   后端部署状态检查
echo ========================================
echo.

echo 正在检查可能的后端地址...
echo.

echo [1] 检查 cosmetic-ve-server.vercel.app
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://cosmetic-ve-server.vercel.app/health' -UseBasicParsing; Write-Host '✅ 后端在线:' $response.StatusCode -ForegroundColor Green; $response.Content } catch { Write-Host '❌ 无法访问' -ForegroundColor Red; $_.Exception.Message }"
echo.

echo [2] 检查 cosmetic-ve-api.vercel.app
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://cosmetic-ve-api.vercel.app/health' -UseBasicParsing; Write-Host '✅ 后端在线:' $response.StatusCode -ForegroundColor Green; $response.Content } catch { Write-Host '❌ 无法访问' -ForegroundColor Red; $_.Exception.Message }"
echo.

echo [3] 检查 cosmetics-api.vercel.app
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://cosmetics-api.vercel.app/health' -UseBasicParsing; Write-Host '✅ 后端在线:' $response.StatusCode -ForegroundColor Green; $response.Content } catch { Write-Host '❌ 无法访问' -ForegroundColor Red; $_.Exception.Message }"
echo.

echo ========================================
echo 📝 检查结果说明
echo ========================================
echo.
echo 如果所有地址都显示 "❌ 无法访问"，说明：
echo   1. 后端尚未部署到 Vercel
echo   2. 需要按照 BACKEND_QUICK_DEPLOY.md 指南进行部署
echo.
echo 如果有地址显示 "✅ 后端在线"，说明：
echo   1. 后端已部署成功
echo   2. 需要更新 apps\web\.env.production 中的 API 地址
echo   3. 然后重新部署前端
echo.
echo ========================================
echo.

pause
