@echo off
echo ========================================
echo 删除旧项目文件夹
echo ========================================
echo.

echo 警告: 此操作将从 Git 中删除以下文件夹:
echo   - apps/frontend (已迁移到 apps/web/src/modules/user)
echo   - apps/admin    (已迁移到 apps/web/src/modules/admin)
echo.

echo 建议在以下情况下执行此操作:
echo 1. apps/web 已成功提交到 Git
echo 2. 在 Vercel 上部署并测试通过
echo 3. 确认所有功能正常运行
echo.

set /p confirm="确定要删除吗? (输入 YES 继续): "

if not "%confirm%"=="YES" (
    echo 操作已取消。
    pause
    exit
)

echo.
echo 正在删除...
echo.

REM 从 Git 中删除
git rm -r apps/frontend
git rm -r apps/admin

echo.
echo 文件已从 Git 中删除（本地文件也会被删除）
echo.

echo 提交删除操作...
git commit -m "chore: 移除已迁移的旧项目文件夹

- 删除 apps/frontend (已迁移到 apps/web/src/modules/user)
- 删除 apps/admin (已迁移到 apps/web/src/modules/admin)
- 所有功能已在 apps/web 中整合"

echo.
echo 推送到远程...
git push origin main

echo.
echo ========================================
echo 删除完成！
echo ========================================
echo.
echo 旧文件夹已从 Git 仓库中移除。
echo 如需恢复，可以使用 Git 历史记录。
echo.
pause
