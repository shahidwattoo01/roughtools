$files = Get-ChildItem "apps\web\src" -Recurse -Filter "page.tsx" | Where-Object {
  (Get-Content $_.FullName -Raw) -match "new Blob\(\[pdfBytes\]"
}

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw
  $content = $content -replace "new Blob\(\[pdfBytes\]", "new Blob([pdfBytes as unknown as ArrayBuffer]"
  [System.IO.File]::WriteAllText($file.FullName, $content)
  Write-Host "Fixed: $($file.Directory.Name)"
}
Write-Host "Total fixed: $($files.Count)"
