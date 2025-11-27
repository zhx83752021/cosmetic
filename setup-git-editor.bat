@echo off
chcp 65001 >nul
echo ==========================================
echo   配置 Git 使用 VS Code 作为编辑器
echo ==========================================
echo.

:: 配置 VS Code 为 Git 默认编辑器
git config --global core.editor "code --wait"

if %errorlevel% equ 0 (
    echo ✓ 配置成功！
    echo.
    echo 现在 Git 会使用 VS Code 而不是 Vim
    echo 即使提交信息格式错误，也会在熟悉的界面中编辑
) else (
    echo ✗ 配置失败，请确保已安装 VS Code
    echo.
    echo 如果 VS Code 未安装，请先安装：
    echo https://code.visualstudio.com/
)

echo.
pause
