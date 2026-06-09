# Fix 1: Remove deprecated onFID from all files
$fidFiles = @(
  "apps\web\src\app\tools\document-tools\add-watermark\page.tsx",
  "apps\web\src\app\tools\document-tools\contract-creator\page.tsx",
  "apps\web\src\app\tools\document-tools\nda-generator\page.tsx",
  "apps\web\src\app\tools\legal-tools\core-tools\contract-generator\page.tsx"
)
foreach ($f in $fidFiles) {
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    $c = $c -replace ",?\s*onFID\b", ""
    $c = $c -replace "^\s*onFID\(handler\);[^\n]*\n", ""
    $c = $c -replace "\s*onFID\(handler\);", ""
    [System.IO.File]::WriteAllText("$PWD\$f", $c)
    Write-Host "Fixed FID: $f"
  }
}

# Fix 2: Add @platform/calculators-core to web app dependencies
$pkgPath = "apps\web\package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
if (-not $pkg.dependencies.'@platform/calculators-core') {
  $pkg.dependencies | Add-Member -NotePropertyName "@platform/calculators-core" -NotePropertyValue "workspace:*" -Force
  $json = $pkg | ConvertTo-Json -Depth 10
  [System.IO.File]::WriteAllText("$PWD\$pkgPath", $json)
  Write-Host "Added @platform/calculators-core to web dependencies"
}
Write-Host "All done"
