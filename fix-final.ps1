$f = "apps\web\src\app\link-to-us\page.tsx"
$content = Get-Content $f -Raw

# Fix missing useState import
if ($content -notmatch "import.*useState.*from") {
  $content = $content -replace "(import \{ useClipboard)", "import { useState } from `"react`"`n`$1"
}

[System.IO.File]::WriteAllText("$PWD\$f", $content)
Write-Host "Fixed link-to-us/page.tsx"
Get-Content $f | Select-Object -First 5
