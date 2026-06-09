$pages = Get-ChildItem "apps\web\src" -Recurse -Filter "page.tsx"
$fixed = 0
foreach ($file in $pages) {
  $lines = Get-Content $file.FullName
  if ($lines.Count -lt 10) {
    $raw = $lines -join " "
    $t = if ($raw -match 't: "([^"]+)"') { $matches[1] } else { "Tool" }
    $l = if ($raw -match 'l: "([^"]+)"') { $matches[1] } else { "" }
    $p = if ($raw -match 'p: "([^"]+)"') { $matches[1] } else { "" }
    $u = if ($raw -match 'u: "([^"]+)"') { $matches[1] } else { "#" }
    $content = @"
'use client'
import React from 'react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <div className="mb-4">
          <Link href=".." className="text-sm text-gray-400 hover:text-white">Back</Link>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-400">$t</h1>
            <p className="text-gray-300 mt-2 text-lg">$l</p>
          </div>
          <a href="$u" target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shrink-0">
            Visit $t
          </a>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-3">Pricing</h2>
            <p className="text-2xl font-bold text-green-400">$p</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-3">Details</h2>
            <p className="text-gray-300">Visit the official website for more information.</p>
          </div>
        </div>
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-sm text-yellow-200">
          <strong>Disclaimer:</strong> Directory listing only. Not affiliated with $t.
        </div>
      </div>
    </div>
  )
}
"@
    Set-Content $file.FullName $content -Encoding UTF8
    $fixed++
    Write-Host "Fixed: $($file.Directory.Name)"
  }
}
Write-Host "Total fixed: $fixed files"
