$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not $env:PYTHON_BIN) {
  $env:PYTHON_BIN = "C:\Program Files\pgAdmin 4\python\python.exe"
}

$python = $env:PYTHON_BIN
$backendDir = Join-Path $root "backend"

$proc = Start-Process -FilePath $python -ArgumentList "run_sidecar.py" -WorkingDirectory $backendDir -PassThru
try {
  Start-Sleep -Seconds 5

  $health = Invoke-RestMethod -Uri "http://127.0.0.1:8765/health"
  $session = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8765/api/sessions" -ContentType "application/json" -Body '{"title":"Smoke Test Meeting"}'
  $sampleText = "Need date filter in reports"
  $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($sampleText))

  Invoke-RestMethod -Method Post -Uri ("http://127.0.0.1:8765/api/sessions/{0}/audio-chunk" -f $session.id) -ContentType "application/json" -Body (@{
    source = "desktop"
    sample_rate_hz = 16000
    mime_type = "audio/wav"
    audio_base64 = $b64
  } | ConvertTo-Json)

  $stories = Invoke-RestMethod -Uri ("http://127.0.0.1:8765/api/sessions/{0}/stories" -f $session.id)
  if ($stories.Count -gt 0) {
    Invoke-RestMethod -Method Post -Uri ("http://127.0.0.1:8765/api/sessions/{0}/stories/{1}/confirm" -f $session.id, $stories[0].id) | Out-Null
  }

  Invoke-RestMethod -Method Post -Uri ("http://127.0.0.1:8765/api/sessions/{0}/stop" -f $session.id) | Out-Null
  $summary = Invoke-RestMethod -Uri ("http://127.0.0.1:8765/api/sessions/{0}/summary" -f $session.id)

  [pscustomobject]@{
    health = $health.status
    session_id = $session.id
    story_count = $stories.Count
    summary_ready = [bool]$summary.markdown
  } | Format-List
}
finally {
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
