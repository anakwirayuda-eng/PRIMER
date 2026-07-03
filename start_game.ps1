# ============================================
# PRIMER GAME - ONE-CLICK START GAME SCRIPT
# ============================================
# Double-click 'run_game.bat' untuk menjalankan script ini.
# Script akan otomatis:
#   1. Mengecek apakah node_modules sudah ada
#   2. Menjalankan Vite via wrapper Node lokal jika dependencies tersedia
#   3. Membuka browser secara otomatis
# ============================================

$projectRoot = $PSScriptRoot
$runVite = Join-Path $projectRoot "tools\run-vite.ps1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRIMER GAME - STARTING..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Pindah ke direktori project
Set-Location -Path $projectRoot

# Cek apakah node_modules sudah ada
$nodeModulesPath = Join-Path $projectRoot "node_modules"

if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "[1/3] node_modules belum ada." -ForegroundColor Red
    Write-Host "     Runtime lokal sekarang bisa menjalankan vite/vitest tanpa Node global," -ForegroundColor Gray
    Write-Host "     tetapi tetap butuh dependencies yang sudah terpasang." -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Jalankan instalasi dependency dari environment yang punya npm," -ForegroundColor White
    Write-Host "  lalu ulangi script ini." -ForegroundColor White
    Write-Host ""
    Write-Host "Tekan tombol apa saja untuk menutup..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "[1/3] Dependencies sudah ada (skip install)" -ForegroundColor Green

Write-Host "[2/3] Memulai development server..." -ForegroundColor Yellow
Write-Host ""

# Tunggu sebentar lalu buka browser
Write-Host "[3/3] Browser akan terbuka di http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  GAME BERJALAN!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  URL      : http://localhost:5173" -ForegroundColor White
Write-Host "  Untuk berhenti: tekan Ctrl+C" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Buka browser setelah 2 detik (beri waktu server untuk start)
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173"
} | Out-Null

# Jalankan vite via wrapper lokal (ini akan blocking sampai user stop dengan Ctrl+C)
& $runVite
