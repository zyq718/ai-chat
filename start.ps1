# AI Chat Startup Script
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   AI Chat - Smart Chat Assistant" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 0. Check dependencies
$needInstall = $false
if (-not (Test-Path "E:\ai\frontend\node_modules\next\dist\bin\next")) { $needInstall = $true }
if (-not (Test-Path "E:\ai\backend\venv\Scripts\python.exe")) { 
    Write-Host "ERROR: Backend venv not found. Run setup first." -ForegroundColor Red
    exit 1
}

if ($needInstall) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location E:\ai\frontend
    npm install --registry=https://registry.npmjs.org --no-audit --no-fund --loglevel=error
    Pop-Location
    Write-Host "Done." -ForegroundColor Green
}

# 1. Kill old processes
Write-Host "[0/2] Cleaning up old processes..." -ForegroundColor Gray
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.StartTime -gt (Get-Date).AddMinutes(-30) } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# 2. Start backend
Write-Host "[1/2] Starting backend Flask (port 5000)..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "E:\ai\backend\venv\Scripts\python.exe" `
    -ArgumentList "E:\ai\backend\run.py" `
    -WorkingDirectory "E:\ai\backend" `
    -PassThru

Start-Sleep -Seconds 3
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/health" -TimeoutSec 5
    Write-Host "  -> Backend OK: $($health.data.status)" -ForegroundColor Green
} catch {
    Write-Host "  -> Backend starting..." -ForegroundColor Yellow
}

# 3. Start frontend
Write-Host ""
Write-Host "[2/2] Starting frontend Next.js (port 3000)..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath "npm.cmd" `
    -ArgumentList "run", "dev" `
    -WorkingDirectory "E:\ai\frontend" `
    -PassThru

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Started successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "  Open http://localhost:3000 in your browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "  To stop: close this window or press Ctrl+C" -ForegroundColor Gray
Write-Host ""

# Auto open browser after frontend is ready
Start-Sleep -Seconds 8
Start-Process "http://localhost:3000"

# Keep window open
Write-Host "Press Ctrl+C to stop both services..." -ForegroundColor DarkGray
$backend.WaitForExit()
