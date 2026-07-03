param(
    [Parameter(ValueFromRemainingArguments = $true, Position = 0)]
    [string[]]$Arguments
)

& (Join-Path $PSScriptRoot 'run-with-local-node.ps1') vitest @Arguments
exit $LASTEXITCODE
