# AI Chat 项目 - GitCode 推送脚本
# 在 E:\ai 目录下运行: powershell -ExecutionPolicy Bypass -File push_to_gitcode.ps1

$OutputEncoding = [System.Text.Encoding]::UTF8

$remoteUrl = "https://gitcode.com/zzzqqyy/zyqai.git"
$projectRoot = "E:\ai"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  AI Chat -> GitCode Push Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target: $remoteUrl" -ForegroundColor Yellow
Write-Host ""

Set-Location $projectRoot

# 1. 移除已有同名 remote
git remote remove gitcode 2>$null
Write-Host "[1/5] Removed old gitcode remote (if any)" -ForegroundColor Gray

# 2. 添加 remote
git remote add gitcode $remoteUrl
Write-Host "[2/5] Added gitcode remote" -ForegroundColor Green

# 3. 把 master 分支改名为 main (GitCode 默认是 main)
git branch -M main
Write-Host "[3/5] Renamed branch: master -> main" -ForegroundColor Green

# 4. 推送到 GitCode
Write-Host "[4/5] Pushing to GitCode (need your login)..." -ForegroundColor Yellow
git push -u gitcode main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[5/5] Push successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "  Visit your repo:" -ForegroundColor Green
    Write-Host "  $remoteUrl" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[5/5] Push FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common causes:" -ForegroundColor Yellow
    Write-Host "  1. Wrong username/password" -ForegroundColor White
    Write-Host "  2. Need 2FA token instead of password" -ForegroundColor White
    Write-Host "  3. Repo doesn't exist or no permission" -ForegroundColor White
    Write-Host ""
    Write-Host "Try again with:" -ForegroundColor Cyan
    Write-Host "  git push -u gitcode main" -ForegroundColor White
}
Write-Host ""
