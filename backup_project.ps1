# ============================================
# PRIMER GAME - ONE-CLICK BACKUP SCRIPT
# ============================================
# Double-click 'run_backup.bat' untuk menjalankan script ini.
# Backup akan disimpan di folder '_backups' dengan nama bertimestamp.
#
# Yang TIDAK ikut ter-backup (agar file kecil & cepat):
#   - node_modules (bisa di-install ulang dgn 'npm install')
#   - dist         (bisa di-build ulang dgn 'npm run build')
#   - .git         (history git, biasanya besar)
#   - _backups     (backup lama, agar tak terjadi loop)
# ============================================

$projectName = "primer-game"
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$backupName = "${projectName}_backup_$timestamp.zip"

# Lokasi project = lokasi script ini berada
$projectRoot = $PSScriptRoot
$backupFolder = Join-Path $projectRoot "_backups"

# Buat folder _backups jika belum ada
if (-not (Test-Path $backupFolder)) {
    New-Item -ItemType Directory -Path $backupFolder | Out-Null
}

$destinationPath = Join-Path $backupFolder $backupName

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRIMER GAME - PROJECT BACKUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Daftar folder yang di-SKIP (tidak perlu di-backup)
$excludeDirs = @("node_modules", "dist", ".git", "_backups", ".next")

# Kumpulkan semua item top-level yang BUKAN folder yang di-exclude
$itemsToBackup = Get-ChildItem -Path $projectRoot | Where-Object {
    -not ($_.PSIsContainer -and $excludeDirs -contains $_.Name)
}

$itemCount = ($itemsToBackup | Measure-Object).Count
Write-Host "Memproses $itemCount item..." -ForegroundColor Yellow

# Buat temporary folder, copy items kesana, lalu zip
$tempDir = Join-Path $env:TEMP "primer_backup_temp_$timestamp"
New-Item -ItemType Directory -Path $tempDir | Out-Null

foreach ($item in $itemsToBackup) {
    $dest = Join-Path $tempDir $item.Name
    if ($item.PSIsContainer) {
        Copy-Item -Path $item.FullName -Destination $dest -Recurse -Force
    } else {
        Copy-Item -Path $item.FullName -Destination $dest -Force
    }
}

# Compress dari temp folder
Compress-Archive -Path "$tempDir\*" -DestinationPath $destinationPath -Force

# Hapus temp folder
Remove-Item -Path $tempDir -Recurse -Force

# Tampilkan hasil
if (Test-Path $destinationPath) {
    $sizeMB = [Math]::Round((Get-Item $destinationPath).Length / 1MB, 2)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  BACKUP BERHASIL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  File : $backupName" -ForegroundColor White
    Write-Host "  Lokasi : $backupFolder" -ForegroundColor White
    Write-Host "  Ukuran : $sizeMB MB" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "  BACKUP GAGAL!" -ForegroundColor Red
    Write-Host "  Silakan coba lagi atau hubungi developer." -ForegroundColor Red
    Write-Host ""
}

Write-Host "Tekan tombol apa saja untuk menutup..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
