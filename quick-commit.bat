@echo off
chcp 65001 >nul
:: 快速提交脚本 - 直接使用参数提交

if "%~1"=="" (
    echo 用法: quick-commit.bat [类型] [描述]
    echo.
    echo 示例:
    echo   quick-commit.bat feat 添加用户登录功能
    echo   quick-commit.bat fix 修复登录500错误
    echo   quick-commit.bat docs 更新部署文档
    echo.
    echo 允许的类型: feat fix docs style refactor perf test chore build
    pause
    exit /b 1
)

if "%~2"=="" (
    echo [错误] 请提供提交描述
    echo 用法: quick-commit.bat [类型] [描述]
    pause
    exit /b 1
)

:: 获取所有参数作为描述（从第二个参数开始）
set "type=%~1"
set "message=%~2"
shift
shift
:concat_loop
if not "%~1"=="" (
    set "message=%message% %~1"
    shift
    goto concat_loop
)

:: 执行提交
set "commit_message=%type%: %message%"
echo 提交信息: %commit_message%
echo.

git commit -m "%commit_message%"

if %errorlevel% equ 0 (
    echo ✓ 提交成功！
) else (
    echo ✗ 提交失败
    pause
    exit /b 1
)
