 $allPass = $true

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PHASE 1 FINAL VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Package dist folders
Write-Host "1. Checking package builds..." -ForegroundColor Yellow
 $packages = @(
    @{Name="utils"; Pkg="@platform/utils"},
    @{Name="errors"; Pkg="@platform/errors"},
    @{Name="validation"; Pkg="@platform/validation"},
    @{Name="config"; Pkg="@platform/config"},
    @{Name="db"; Pkg="@platform/db"}
)
foreach ($pkg in $packages) {
    $distPath = "packages\$($pkg.Name)\dist\index.js"
    $typesPath = "packages\$($pkg.Name)\dist\index.d.ts"
    if ((Test-Path $distPath) -and (Test-Path $typesPath)) {
        Write-Host "   PASS: $($pkg.Pkg) has dist files" -ForegroundColor Green
    } else {
        Write-Host "   FAIL: $($pkg.Pkg) missing dist files" -ForegroundColor Red
        $allPass = $false
    }
}

# Check 2: Docker containers
Write-Host ""
Write-Host "2. Checking Docker containers..." -ForegroundColor Yellow
 $pgRunning = docker ps --filter "name=roughtools_postgres" --format "{{.Status}}" 2>$null
if ($pgRunning -match "Up") {
    Write-Host "   PASS: PostgreSQL container is running" -ForegroundColor Green
} else {
    Write-Host "   FAIL: PostgreSQL container is NOT running" -ForegroundColor Red
    $allPass = $false
}
 $redisRunning = docker ps --filter "name=roughtools_redis" --format "{{.Status}}" 2>$null
if ($redisRunning -match "Up") {
    Write-Host "   PASS: Redis container is running" -ForegroundColor Green
} else {
    Write-Host "   FAIL: Redis container is NOT running" -ForegroundColor Red
    $allPass = $false
}

# Check 3: Database tables
Write-Host ""
Write-Host "3. Checking database tables..." -ForegroundColor Yellow
 $requiredTables = @("users", "sessions", "tools", "favorites", "blog_posts", "api_usage_logs")
 $tables = docker exec roughtools_postgres psql -U postgres -d roughtools-c "\dt" -t 2>$null
foreach ($table in $requiredTables) {
    if ($tables -match $table) {
        Write-Host "   PASS: Table '$table' exists" -ForegroundColor Green
    } else {
        Write-Host "   FAIL: Table '$table' missing" -ForegroundColor Red
        $allPass = $false
    }
}

# Check 4: Seed data
Write-Host ""
Write-Host "4. Checking seed data..." -ForegroundColor Yellow
 $toolCount = docker exec roughtools_postgres psql -U postgres -d roughtools-t -c "SELECT COUNT(*) FROM tools;" 2>$null
 $toolCount = ($toolCount | Where-Object { $_ -match "\d+" } | ForEach-Object { ($_ -replace '\D','') } | Select-Object -First 1)
if ([int]$toolCount -ge 12) {
    Write-Host "   PASS: $toolCount tools seeded in database" -ForegroundColor Green
} else {
    Write-Host "   FAIL: Only $toolCount tools in database (expected 12+)" -ForegroundColor Red
    $allPass = $false
}

# Check 5: Redis
Write-Host ""
Write-Host "5. Checking Redis connection..." -ForegroundColor Yellow
 $redisResult = docker exec roughtools_redis redis-cli ping 2>$null
if ($redisResult -match "PONG") {
    Write-Host "   PASS: Redis is responding" -ForegroundColor Green
} else {
    Write-Host "   FAIL: Redis not responding" -ForegroundColor Red
    $allPass = $false
}

# Check 6: Environment files
Write-Host ""
Write-Host "6. Checking environment files..." -ForegroundColor Yellow
 $envFiles = @(
    @{Path="apps\web\.env.local"; Name="Web .env.local"},
    @{Path="apps\api\.env"; Name="API .env"},
    @{Path="packages\db\.env"; Name="DB .env"}
)
foreach ($env in $envFiles) {
    if (Test-Path $env.Path) {
        $content = Get-Content $env.Path -Raw
        if ($content.Length -gt 10) {
            Write-Host "   PASS: $($env.Name) exists and has content" -ForegroundColor Green
        } else {
            Write-Host "   FAIL: $($env.Name) exists but is empty" -ForegroundColor Red
            $allPass = $false
        }
    } else {
        Write-Host "   FAIL: $($env.Name) does not exist" -ForegroundColor Red
        $allPass = $false
    }
}

# Check 7: Workspace symlinks in web app
Write-Host ""
Write-Host "7. Checking workspace package links (web)..." -ForegroundColor Yellow
 $wsPackages = @("utils", "errors", "validation", "config", "db", "calculators-core")
foreach ($pkg in $wsPackages) {
    $linkPath = "apps\web\node_modules\@platform\$pkg"
    if (Test-Path $linkPath) {
        # Check that the dist folder is accessible through the symlink
        $distPath = "apps\web\node_modules\@platform\$pkg\dist\index.js"
        if (Test-Path $distPath) {
            Write-Host "   PASS: @platform/$pkg linked AND has dist" -ForegroundColor Green
        } else {
            Write-Host "   WARN: @platform/$pkg linked but dist missing (needs build)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   FAIL: @platform/$pkg NOT linked in web app" -ForegroundColor Red
        $allPass = $false
    }
}

# Check 8: Workspace symlinks in API
Write-Host ""
Write-Host "8. Checking workspace package links (API)..." -ForegroundColor Yellow
 $apiPackages = @("utils", "errors", "validation", "config", "db")
foreach ($pkg in $apiPackages) {
    $linkPath = "apps\api\node_modules\@platform\$pkg"
    if (Test-Path $linkPath) {
        Write-Host "   PASS: @platform/$pkg linked in API" -ForegroundColor Green
    } else {
        Write-Host "   FAIL: @platform/$pkg NOT linked in API" -ForegroundColor Red
        $allPass = $false
    }
}

# Check 9: API health endpoint
Write-Host ""
Write-Host "9. Checking API health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/health" -TimeoutSec 5 -ErrorAction Stop
    if ($health.success -eq $true -and $health.data.database -eq "connected") {
        Write-Host "   PASS: API healthy, database connected" -ForegroundColor Green
    } elseif ($health.success -eq $true) {
        Write-Host "   WARN: API up but database disconnected" -ForegroundColor Yellow
    } else {
        Write-Host "   FAIL: API returned unsuccessful response" -ForegroundColor Red
        $allPass = $false
    }
} catch {
    Write-Host "   FAIL: API not responding at localhost:3001" -ForegroundColor Red
    Write-Host "         Start it: cd apps\api; pnpm dev" -ForegroundColor Yellow
    $allPass = $false
}

# Check 10: Web app
Write-Host ""
Write-Host "10. Checking web app..." -ForegroundColor Yellow
try {
    $webResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    if ($webResponse.StatusCode -eq 200) {
        Write-Host "   PASS: Web app serving pages (HTTP 200)" -ForegroundColor Green
    } else {
        Write-Host "   FAIL: Web app returned status $($webResponse.StatusCode)" -ForegroundColor Red
        $allPass = $false
    }
} catch {
    Write-Host "   FAIL: Web app not responding at localhost:3000" -ForegroundColor Red
    Write-Host "         Start it: cd apps\web; pnpm dev" -ForegroundColor Yellow
    $allPass = $false
}

# Check 11: .gitignore
Write-Host ""
Write-Host "11. Checking .gitignore..." -ForegroundColor Yellow
 $gitignore = Get-Content ".gitignore" -ErrorAction SilentlyContinue
if ($gitignore -match "\.env") {
    Write-Host "   PASS: .gitignore includes .env patterns" -ForegroundColor Green
} else {
    Write-Host "   WARN: .gitignore may not cover .env files" -ForegroundColor Yellow
}

# Final result
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allPass) {
    Write-Host "  ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "  Phase 1 is COMPLETE." -ForegroundColor Green
} else {
    Write-Host "  SOME CHECKS FAILED." -ForegroundColor Red
    Write-Host "  Fix the failures above before proceeding." -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
