param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Tool,

    [Parameter(ValueFromRemainingArguments = $true, Position = 1)]
    [string[]]$Arguments
)

$projectRoot = Split-Path -Parent $PSScriptRoot

$nodeCandidates = @(
    $env:PRIMER_NODE_DIR,
    (Join-Path $env:ProgramFiles 'nodejs'),
    (Join-Path ${env:ProgramFiles(x86)} 'nodejs'),
    (Join-Path $env:LOCALAPPDATA 'ms-playwright-go\1.50.1')
) | Where-Object { $_ -and (Test-Path (Join-Path $_ 'node.exe')) }

$nodeDir = $nodeCandidates | Select-Object -First 1

if (-not $nodeDir) {
    Write-Error "Node.js tidak ditemukan. Set env PRIMER_NODE_DIR atau install Node.js."
    exit 1
}

$env:PATH = "$nodeDir;$env:PATH"

$toolMap = @{
    node = (Join-Path $nodeDir 'node.exe')
    vite = (Join-Path $projectRoot 'node_modules\.bin\vite.cmd')
    vitest = (Join-Path $projectRoot 'node_modules\.bin\vitest.cmd')
    playwright = (Join-Path $projectRoot 'node_modules\.bin\playwright.cmd')
}

$resolvedTool = $toolMap[$Tool.ToLower()]
if (-not $resolvedTool) {
    $resolvedTool = $Tool
}

if (-not (Test-Path $resolvedTool) -and $resolvedTool -ne $Tool) {
    Write-Error "Tool '$Tool' tidak ditemukan di workspace: $resolvedTool"
    exit 1
}

Push-Location $projectRoot
try {
    & $resolvedTool @Arguments
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
