@echo off
echo ========================================
echo Setup PM2 Auto-Start on Windows
echo ========================================
echo.

echo Step 1: Generate startup script
echo Running: pm2 startup
pm2 startup
echo.

echo ========================================
echo IMPORTANT: 
echo Copy and run the command above as Administrator!
echo ========================================
echo.

echo Step 2: Save current PM2 processes
echo Running: pm2 save
pm2 save
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To verify:
echo 1. Restart your computer
echo 2. Open terminal and run: pm2 list
echo 3. Your app should be running automatically
echo.

pause
