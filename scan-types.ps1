$results = @()
Get-ChildItem "apps\web\src" -Recurse -Filter "page.tsx" | ForEach-Object {
  $c = Get-Content $_.FullName -Raw
  $rel = $_.FullName -replace ".*apps\\web\\src\\", ""
  $issues = @()
  if ($c -match "canvasContext.*viewport") { $issues += "PDF_RENDER_PARAMS" }
  if ($c -match "new Blob\(\[(?!.*as unknown)") { $issues += "BLOB_TYPE" }
  if ($c -match "as const\b" -and $c -notmatch "satisfies|as const }") { $issues += "CHECK_CONST" }
  if ($issues.Count -gt 0) {
    $results += "$rel -> $($issues -join ', ')"
  }
}
$results
Write-Host "Total: $($results.Count)"
