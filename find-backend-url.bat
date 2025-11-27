@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   查找后端 API 实际地址
echo ========================================
echo.
echo 🔍 请在 Vercel Dashboard 中查找你的后端项目名称
echo.
echo 步骤：
echo 1. 访问 https://vercel.com/dashboard
echo 2. 找到你的后端项目（可能是以下名称之一）：
echo    - cosmetic-ve-server
echo    - cosmetics-api
echo    - cosmetic-ve-api
echo    - 或者其他名称
echo 3. 进入项目，点击最新的 Deployment
echo 4. 复制 "Domains" 中显示的域名
echo.
echo ========================================
echo.
echo 请输入你的后端域名（例如：cosmetic-ve-server-abc123.vercel.app）
echo 不要包含 https:// 和路径
set /p BACKEND_URL="后端域名: "
echo.
echo 正在测试后端连接...
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://%BACKEND_URL%/health' -UseBasicParsing; Write-Host '✅ 后端在线！' -ForegroundColor Green; Write-Host 'API 地址:' 'https://%BACKEND_URL%/api' -ForegroundColor Cyan; $response.Content; echo ''; echo '========================================'; echo '📝 下一步操作:'; echo '========================================'; echo ''; echo '1. 更新前端配置文件:'; echo '   编辑: apps\web\.env.production'; echo '   修改为: VITE_API_BASE_URL=https://%BACKEND_URL%/api'; echo ''; echo '2. 重新部署前端:'; echo '   git add apps\web\.env.production'; echo '   git commit -m \"fix: 更新生产环境 API 地址\"'; echo '   git push origin main'; echo ''; } catch { Write-Host '❌ 无法连接到后端' -ForegroundColor Red; Write-Host '错误:' $_.Exception.Message -ForegroundColor Yellow; echo ''; echo '可能的原因:'; echo '1. 域名输入错误'; echo '2. 后端部署失败'; echo '3. 健康检查接口未配置'; echo ''; echo '请检查 Vercel 项目的部署状态'; }"

echo.
pause
