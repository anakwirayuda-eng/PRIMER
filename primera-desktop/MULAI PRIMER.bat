@echo off
rem =====================================================
rem   PRIMER - Puskesmas Pagi  :  tombol start game
rem   Klik dua kali file ini untuk bermain.
rem =====================================================
set "EXE=%~dp0dist\win-unpacked\PRIMER - Puskesmas Pagi.exe"

if exist "%EXE%" (
  start "" "%EXE%"
  exit /b 0
)

echo.
echo  ============================================
echo   File game belum ter-build di komputer ini.
echo   Buka terminal di folder ini, jalankan:
echo.
echo       npm install
echo       npm run pack
echo.
echo   (cukup sekali) lalu klik dua kali file ini lagi.
echo  ============================================
echo.
pause
