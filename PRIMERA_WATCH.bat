@echo off
echo ==========================================
echo    PRIMERA WATCHDOG - Live Sync Mode
echo ==========================================
echo [PRIMERA] Scanning Structural Intelligence...
call node scripts/primera/sentinel.mjs
echo [PRIMERA] Syncing Megalog...
call node scripts/primera/megalog_v5.mjs
pause
