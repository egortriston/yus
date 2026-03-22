$ErrorActionPreference = "Stop"

$python = "C:\Program Files\pgAdmin 4\python\python.exe"
$root = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $root "backend"
Get-Process | Where-Object { $_.ProcessName -eq "python" } | Stop-Process -Force -ErrorAction SilentlyContinue
Set-Location $backendDir
$env:API_PORT = "8766"
$proc = Start-Process -FilePath $python -ArgumentList ".\\run_sidecar.py" -PassThru

try {
  Start-Sleep -Seconds 5
  $settingsPayload = @{
    llm_provider = "qwen-local-openai-compatible"
    llm_model = "qwen-plus"
    embedding_provider = "qwen-local-openai-compatible"
    embedding_model = "text-embedding-v4"
    stt_provider = "qwen-dashscope-asr-realtime"
    stt_model = "qwen3-asr-flash-realtime"
    batch_stt_provider = "qwen-dashscope-asr-file"
    batch_stt_model = "qwen3-asr-flash-filetrans"
    provider_base_url = "http://127.0.0.1:11434/v1"
    provider_region = "local"
    api_key_ref = $null
    user_country = "RU"
    user_timezone = "Europe/Moscow"
    ui_language = "ru-RU"
    transcript_language = "auto"
    audio_storage_enabled = $true
    audio_storage_dir = $null
  } | ConvertTo-Json
  $settings = Invoke-RestMethod -Method Put -Uri "http://127.0.0.1:8766/api/settings" -ContentType "application/json" -Body $settingsPayload
  $settingsRaw = Invoke-WebRequest -Uri "http://127.0.0.1:8766/api/settings" | Select-Object -ExpandProperty Content
  $session = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8766/api/sessions" -ContentType "application/json" -Body '{"title":"Audio Save Smoke"}'
  $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("need report filter"))
  Invoke-RestMethod -Method Post -Uri ("http://127.0.0.1:8766/api/sessions/{0}/audio-chunk" -f $session.id) -ContentType "application/json" -Body (@{
    source = "mic"
    sample_rate_hz = 16000
    mime_type = "audio/webm"
    audio_base64 = $b64
  } | ConvertTo-Json) | Out-Null
  $detail = Invoke-RestMethod -Uri ("http://127.0.0.1:8766/api/sessions/{0}" -f $session.id)

  [pscustomobject]@{
    settings_json = $settingsRaw
    user_country = $settings.user_country
    timezone = $settings.user_timezone
    llm_provider = $settings.llm_provider
    audio_storage_enabled = $settings.audio_storage_enabled
    raw_audio_path = $detail.raw_audio_path
    exists = if ($detail.raw_audio_path) { [bool](Test-Path $detail.raw_audio_path) } else { $false }
  } | Format-List
}
finally {
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
