# Script de vérification de la structure du build Electron
# À exécuter dans le dossier contenant le build final (ex: win-unpacked)
$buildPath = "C:\Users\Martin\Desktop\LiBo2025-win32-x64\win-unpacked"


Write-Host "Vérification de la structure du build Electron..."

$checks = @(
    "LiBo2025.exe",
    "main.js",
    "preload.js",
    "backend\node.exe",
    "backend\server.js",
    "backend\node_modules",
    "build\index.html"
)

foreach ($item in $checks) {
    $fullPath = Join-Path $buildPath $item
    if (Test-Path $fullPath) {
        Write-Host "OK: $item"
    } else {
        Write-Host "MANQUANT: $item" -ForegroundColor Red
    }
}
