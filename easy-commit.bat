@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo   Git 提交助手
echo ==========================================
echo.
echo 允许的提交类型:
echo   feat     - 新功能
echo   fix      - 修复bug
echo   docs     - 文档更新
echo   style    - 代码格式
echo   refactor - 重构
echo   perf     - 性能优化
echo   test     - 测试
echo   chore    - 构建/工具
echo   build    - 构建相关
echo.

:: 选择提交类型
set /p type="请输入提交类型 (默认: feat): "
if "%type%"=="" set type=feat

:: 输入提交描述
set /p message="请输入提交描述: "
if "%message%"=="" (
    echo [错误] 提交描述不能为空！
    pause
    exit /b 1
)

:: 构建完整的提交信息
set "commit_message=%type%: %message%"

:: 显示将要提交的信息
echo.
echo ==========================================
echo 提交信息预览:
echo %commit_message%
echo ==========================================
echo.

:: 确认提交
set /p confirm="确认提交? (y/n): "
if /i not "%confirm%"=="y" (
    echo 已取消提交
    pause
    exit /b 0
)

:: 执行提交
echo.
echo 正在提交...
git commit -m "%commit_message%"

if %errorlevel% equ 0 (
    echo.
    echo ✓ 提交成功！
    echo.
    set /p push="是否推送到远程? (y/n): "
    if /i "!push!"=="y" (
        echo 正在推送...
        git push origin main
        if !errorlevel! equ 0 (
            echo ✓ 推送成功！
        ) else (
            echo ✗ 推送失败
        )
    )
) else (
    echo.
    echo ✗ 提交失败，请检查错误信息
)

echo.
pause
