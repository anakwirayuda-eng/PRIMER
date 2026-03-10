@echo off
echo ==========================================
echo    PRIMERA Smart Injector
echo ==========================================
echo.
echo   Select mode:
echo   [1] Inject single file (enter path)
echo   [2] Inject ALL missing headers
echo   [3] Preview only (dry run)
echo.
set /p mode="   Choice [1-3]: "

if "%mode%"=="1" (
    set /p file="   Enter file path (e.g. src/App.jsx): "
    node scripts/primera/inject_reflection.mjs %file%
) else if "%mode%"=="2" (
    node scripts/primera/inject_reflection.mjs --all
) else if "%mode%"=="3" (
    node scripts/primera/inject_reflection.mjs --all --dry
) else (
    echo Invalid option.
)
pause
