@echo off
TITLE Primer Game - Project Backup
echo Starting Backup Process...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0backup_project.ps1"
pause
