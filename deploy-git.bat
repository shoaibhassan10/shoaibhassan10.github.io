@echo off
echo ========================================================
echo Shoaib Hassan Portfolio - GitHub Pages Deployment Helper
echo ========================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Git CLI was not detected on your system PATH.
    echo.
    echo Fast Alternative (60 seconds, no installation needed):
    echo 1. Open: https://github.com/new
    echo 2. Repository name: shoaibhassan10.github.io
    echo 3. Set to Public and click 'Create repository'
    echo 4. Click 'upload an existing file', drag all files from this folder, and click Commit!
    echo.
    echo Your site will go live at: https://shoaibhassan10.github.io/
    echo.
    pause
    exit /b
)

echo [1/4] Initializing local git repository...
git init
echo [2/4] Staging files...
git add .
echo [3/4] Creating commit...
git commit -m "Deploy Shoaib Hassan personal portfolio"
git branch -M main
echo [4/4] Connecting remote...
git remote remove origin 2>nul
git remote add origin https://github.com/shoaibhassan10/shoaibhassan10.github.io.git
echo.
echo Pushing to GitHub Pages (shoaibhassan10.github.io)...
git push -u origin main
echo.
echo ========================================================
echo Deployment command sent! Your portfolio will be live at:
echo https://shoaibhassan10.github.io/
echo ========================================================
pause
