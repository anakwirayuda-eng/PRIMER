@echo off
chcp 65001 >nul 2>&1
title PRIMERA Codebase Intelligence Dashboard

:MENU
cls
echo.
echo   ╔══════════════════════════════════════════════════╗
echo   ║     PRIMERA CODEBASE INTELLIGENCE v2.0          ║
echo   ╠══════════════════════════════════════════════════╣
echo   ║                                                  ║
echo   ║   [1] Full Sync (Reflect + Megalog)              ║
echo   ║   [2] Auto-Inject Missing Headers                ║
echo   ║   [3] Auto-Inject (Dry Run Preview)              ║
echo   ║   [4] Auto-Fix + Audit                           ║
echo   ║   [5] Start Watchdog (Live Mode)                 ║
echo   ║   [6] View Health Score                          ║
echo   ║   [7] Open Megalog in Editor                     ║
echo   ║   [8] Exit                                       ║
echo   ║                                                  ║
echo   ╚══════════════════════════════════════════════════╝
echo.
set /p choice="   Select option [1-8]: "

if "%choice%"=="1" goto SYNC
if "%choice%"=="2" goto INJECT
if "%choice%"=="3" goto DRY
if "%choice%"=="4" goto AUTOFIX
if "%choice%"=="5" goto WATCH
if "%choice%"=="6" goto HEALTH
if "%choice%"=="7" goto OPEN
if "%choice%"=="8" goto EXIT

echo   Invalid option. Try again.
timeout /t 2 >nul
goto MENU

:SYNC
echo.
echo   Running Full Sync...
echo   ═══════════════════════════════════════
node scripts/primera/reflect_and_sync.mjs
echo.
echo   Sync complete!
pause
goto MENU

:INJECT
echo.
echo   Auto-Injecting Missing Headers...
echo   ═══════════════════════════════════════
node scripts/primera/inject_reflection.mjs --all
echo.
echo   Injection complete! Running sync...
node scripts/primera/reflect_and_sync.mjs
pause
goto MENU

:DRY
echo.
echo   Dry Run Preview (no files will be changed)...
echo   ═══════════════════════════════════════
node scripts/primera/inject_reflection.mjs --all --dry
pause
goto MENU

:AUTOFIX
echo.
echo   Running Auto-Fix Orchestrator...
echo   ═══════════════════════════════════════
node scripts/primera/auto_fix_orchestrator.mjs
pause
goto MENU

:WATCH
echo.
echo   Starting Watchdog (Press Ctrl+C to stop)...
echo   ═══════════════════════════════════════
node scripts/primera/megalog_v5.mjs
pause
goto MENU

:HEALTH
echo.
echo   Running Quick Health Check...
echo   ═══════════════════════════════════════
node scripts/primera/reflect_and_sync.mjs
echo.
echo   Results written to PRIMERA_megalog.md
echo   Opening in VS Code...
code PRIMERA_megalog.md
pause
goto MENU

:OPEN
code PRIMERA_megalog.md
goto MENU

:EXIT
echo.
echo   Goodbye!
exit /b 0
