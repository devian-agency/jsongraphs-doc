$files = Get-ChildItem 'D:\jsongraphs-doc\src\components\doc-sections-*.tsx'
foreach ($f in $files) {
  $c = Get-Content $f.FullName -Raw
  $c = $c -replace 'font-mono text-xs px-1\.5 py-0\.5 rounded bg-accent/60 text-accent-foreground', 'font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15'
  Set-Content -Path $f.FullName -Value $c -NoNewline
  Write-Host "Done: $($f.Name)"
}
