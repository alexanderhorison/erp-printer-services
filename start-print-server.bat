@echo off
cd /d D:\print-be-service\print-server
start "" /min cmd /c "nodemon app.js"
exit