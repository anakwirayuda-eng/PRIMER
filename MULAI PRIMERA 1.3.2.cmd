@echo off
setlocal
cd /d "%~dp0primera-desktop"
set "ELECTRON_RUN_AS_NODE="
if not exist "node_modules\electron\dist\electron.exe" (
  echo Dependensi belum tersedia. Jalankan npm ci di folder primera-desktop.
  pause
  exit /b 1
)
if not exist "out\main\index.js" (
  echo Build belum tersedia. Jalankan npm run build di folder primera-desktop.
  pause
  exit /b 1
)
start "" "node_modules\electron\dist\electron.exe" "."
endlocal
