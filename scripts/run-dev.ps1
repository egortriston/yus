$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not $env:PYTHON_BIN) {
  $env:PYTHON_BIN = "C:\Program Files\pgAdmin 4\python\python.exe"
}

npm run app:dev

