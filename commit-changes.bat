@echo off
echo ========================================
echo Git 提交助手 - 提交新的项目结构
echo ========================================
echo.

echo 当前 Git 仓库: https://github.com/zhx83752021/cosmetic-vue.git
echo.

echo [步骤 1/4] 检查 Git 状态...
git status
echo.

pause
echo.

echo [步骤 2/4] 添加新文件到 Git...
git add apps/web/
git add apps/server/vercel.json
git add vercel.json
git add START_HERE.md
git add QUICK_START.md
git add README_DEPLOYMENT.md
git add DEPLOYMENT.md
git add DEPLOYMENT_SUMMARY.md
git add GIT_COMMIT_GUIDE.md
git add commit-changes.bat

echo 文件已添加！
echo.

echo [步骤 3/4] 提交更改...
git commit -m "refactor: 重组项目结构以适配 Vercel 部署

主要改动:
- 新增 apps/web 统一前端项目 (合并 frontend + admin)
- 用户端路由: /
- 管理后台路由: /admin
- 更新 Vercel 部署配置
- 添加完整部署文档
- 构建验证通过

技术细节:
- apps/frontend -> apps/web/src/modules/user
- apps/admin -> apps/web/src/modules/admin
- 统一路由配置
- Tailwind CSS 使用 tw- 前缀
- 已完成构建测试"

echo 提交完成！
echo.

echo [步骤 4/4] 推送到远程仓库...
echo 即将推送到: origin main
pause

git push origin main

echo.
echo ========================================
echo 提交成功！
echo ========================================
echo.
echo 接下来你可以:
echo 1. 访问 https://github.com/zhx83752021/cosmetic-vue 查看提交
echo 2. 在 Vercel 中部署新的项目结构
echo 3. 验证部署后，可以删除旧的 frontend 和 admin 文件夹
echo.
echo 查看 GIT_COMMIT_GUIDE.md 获取更多帮助
echo.
pause
