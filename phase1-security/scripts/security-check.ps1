Write-Host "Running Security Checks (pnpm)..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/2] Running pnpm audit..." -ForegroundColor Yellow
pnpm audit --audit-level=high
Write-Host ""
Write-Host "[2/2] Checking outdated packages..." -ForegroundColor Yellow
pnpm outdated
Write-Host ""
Write-Host "Security Check Complete!" -ForegroundColor Green