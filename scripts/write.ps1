# Helper to write text files via the text-file skill
# Usage: .\write.ps1 -Path "E:\ai\test.txt" -Content "hello"

param(
    [Parameter(Mandatory=$true)]
    [string]$Path,
    
    [Parameter(Mandatory=$true)]
    [string]$Content,
    
    [string]$Encoding = "utf-8",
    [string]$Newline = "lf"
)

$tempFile = Join-Path $env:TEMP "_tw_$(Get-Random).txt"
[System.IO.File]::WriteAllText($tempFile, $Content, [System.Text.Encoding]::UTF8)

& python "E:\Trae CN\QClaw\v0.2.23.532\resources\openclaw\config\skills\qclaw-text-file\scripts\write_file.py" --path $Path --content-file $tempFile --encoding $Encoding --newline $Newline

Remove-Item $tempFile -ErrorAction SilentlyContinue
