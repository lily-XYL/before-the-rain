$ErrorActionPreference = 'Stop'
$releaseRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\release'))
$packageName = '雨停之前_v1.0.0'
$packagePath = Join-Path $releaseRoot $packageName
$archivePath = Join-Path $releaseRoot ($packageName + '.zip')
$manifestPath = Join-Path $packagePath 'release-manifest.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($manifest.verification -ne 'passed') { throw 'Package verification is incomplete.' }
$expected = @{}
foreach ($file in $manifest.files) { $expected[$packageName + '/' + $file.path] = $file.sha256 }
$expected[$packageName + '/release-manifest.json'] = (Get-FileHash -LiteralPath $manifestPath -Algorithm SHA256).Hash.ToLowerInvariant()
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
$seen = @{}
$algorithm = [System.Security.Cryptography.SHA256]::Create()
try {
  foreach ($entry in $archive.Entries) {
    $entryName = $entry.FullName.Replace('\', '/')
    if ($entryName.EndsWith('/')) { continue }
    if (-not $expected.ContainsKey($entryName)) { throw "Unexpected ZIP entry: $entryName" }
    if ($seen.ContainsKey($entryName)) { throw "Duplicate ZIP entry: $entryName" }
    $stream = $entry.Open()
    try { $hash = [System.BitConverter]::ToString($algorithm.ComputeHash($stream)).Replace('-', '').ToLowerInvariant() }
    finally { $stream.Dispose() }
    if ($hash -ne $expected[$entryName]) { throw "ZIP content differs from release manifest: $entryName" }
    $seen[$entryName] = $true
  }
  if ($seen.Count -ne $expected.Count) { throw 'ZIP contains missing files.' }
} finally { $algorithm.Dispose(); $archive.Dispose() }
$result = [ordered]@{ date = [DateTime]::UtcNow.ToString('o'); archive = $archivePath; entries = $seen.Count; bytes = (Get-Item -LiteralPath $archivePath).Length; sha256 = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant(); verified = $true }
$recordPath = Join-Path $releaseRoot 'verification\archive-verification.json'
$result | ConvertTo-Json | Set-Content -LiteralPath $recordPath -Encoding UTF8
$result | ConvertTo-Json -Compress
