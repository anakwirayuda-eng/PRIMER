@echo off
setlocal enableextensions
rem =====================================================
rem   PRIMERA - Puskesmas Pagi  :  tombol start game
rem   Klik dua kali file ini untuk bermain.
rem =====================================================
set "FOLDER=%~dp0dist\win-unpacked"
set "EXE="
rem Nama produk saat ini (package.json -> build.productName).
if exist "%FOLDER%\PRIMERA test-beta.exe" set "EXE=%FOLDER%\PRIMERA test-beta.exe"
rem Nama produk pernah berubah (PRIMER -> PRIMERA -> test-beta) dan bisa berubah
rem lagi: bila nama di atas tak ada, pakai exe apa pun yang dihasilkan build di
rem folder itu, jangan langsung menyerah dan menyuruh build ulang.
for %%F in ("%FOLDER%\*.exe") do if not defined EXE set "EXE=%%~fF"
if defined EXE start "" "%EXE%"
if defined EXE exit /b 0
echo.
echo  ============================================
echo   File game belum ter-build di komputer ini.
echo   Dicari di folder: dist\win-unpacked
echo.
echo   Buka terminal di folder ini, jalankan:
echo.
echo       npm install
echo       npm run pack
echo.
echo   (cukup sekali) lalu klik dua kali file ini lagi.
echo  ============================================
echo.
pause
