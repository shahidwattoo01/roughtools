$errors = @()
Get-ChildItem "apps\web\src" -Recurse -Include "*.tsx","*.ts" | ForEach-Object {
  $c = Get-Content $_.FullName -Raw
  $rel = $_.FullName -replace ".*apps\\web\\src\\", ""
  if ($c -match "import.*@platform/calculators-core") { $errors += "MISSING_PKG:@platform/calculators-core | $rel" }
  if ($c -match "import.*@toolverse/errors") { $errors += "WRONG_PKG:@toolverse/errors | $rel" }
  if ($c -match "new Blob\(\[[^\]]+\]" -and $c -notmatch "as unknown") { $errors += "BLOB_TYPE | $rel" }
  if ($c -match "onFID") { $errors += "DEPRECATED_FID | $rel" }
}
$errors | Sort-Object -Unique
Write-Host "Total: $($errors.Count)"
