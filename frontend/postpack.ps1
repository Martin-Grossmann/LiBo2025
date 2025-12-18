# Ce script copie backend/node_modules dans le build Electron après le packaging
# Usage : appelé automatiquement par electron-builder (voir package.json)

$source = "..\backend\node_modules"
$dest = "$env:USERPROFILE\Desktop\LiBo2025-win32-x64\win-unpacked\resources\app\backend\node_modules"

Write-Host "Copie de $source vers $dest ..."

# Crée le dossier destination si besoin
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

# Copie récursive avec gestion des chemins longs
robocopy $source $dest /E /COPY:DAT /R:0 /W:0 /NFL /NDL

# Copie node.exe depuis Program Files\nodejs
$nodeSource = "C:\Program Files\nodejs\node.exe"
$nodeDest = "$env:USERPROFILE\Desktop\LiBo2025-win32-x64\win-unpacked\resources\app\backend\node.exe"

if (Test-Path $nodeSource) {
    Copy-Item -Path $nodeSource -Destination $nodeDest -Force
    Write-Host "node.exe copie avec succes"
} else {
    Write-Host "ERREUR: node.exe non trouve"
}

if ($LASTEXITCODE -le 3) {
    Write-Host "Copie terminee."
    exit 0
} else {
    Write-Host "Erreur lors de la copie."
    exit $LASTEXITCODE
}
