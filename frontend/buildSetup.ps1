# Script pour générer et lancer InnoSetup automatiquement
# À exécuter après "npm run dist"

# 0. Copier win-unpacked vers C:\Temp pour raccourcir le chemin
Write-Host "Etape 0: Copie de win-unpacked vers C:\Temp..." -ForegroundColor Cyan
$scriptDir = $PSScriptRoot
$sourceDir = Join-Path -Path $scriptDir -ChildPath "LiBo2025-win32-x64\win-unpacked"
$tempRootDir = "C:\Temp"
if (!(Test-Path $tempRootDir)) {
    New-Item -ItemType Directory -Path $tempRootDir -Force | Out-Null
}
$destDir = Join-Path -Path $tempRootDir -ChildPath "LiBo2025-Build"

# Supprimer l'ancien dossier s'il existe
if (Test-Path $destDir) {
    Write-Host "Suppression de l'ancien dossier de build..." -ForegroundColor Yellow
    # Forcer la suppression avec plusieurs tentatives
    for ($i = 1; $i -le 3; $i++) {
        try {
            Remove-Item -Path $destDir -Recurse -Force -ErrorAction Stop
            Start-Sleep -Milliseconds 500
            if (!(Test-Path $destDir)) {
                Write-Host "Dossier supprime!" -ForegroundColor Green
                break
            }
        }
        catch {
            Write-Host "Tentative $i de suppression..." -ForegroundColor Yellow
            Start-Sleep -Seconds 1
        }
    }
}

# Créer le dossier de destination
New-Item -ItemType Directory -Path $destDir -Force | Out-Null
Start-Sleep -Milliseconds 500

# Copier le dossier avec Robocopy (gère les chemins longs)
Write-Host "Copie en cours avec Robocopy..." -ForegroundColor Yellow
robocopy "$sourceDir" "$destDir" /E /R:0 /W:0 /NFL /NDL /NP /XF "LiBo2025.exe"

$robocopyExitCode = $LASTEXITCODE
Write-Host "Robocopy exit code (sans EXE): $robocopyExitCode" -ForegroundColor Yellow

# Copier l'EXE séparément
Write-Host "Copie de l'EXE..." -ForegroundColor Yellow
$exeSource = Join-Path -Path $sourceDir -ChildPath "LiBo2025.exe"
$exeDest = Join-Path -Path $destDir -ChildPath "LiBo2025.exe"

$maxRetries = 5
for ($i = 1; $i -le $maxRetries; $i++) {
    try {
        Copy-Item -Path $exeSource -Destination $exeDest -Force -ErrorAction Stop
        Write-Host "EXE copie avec succes!" -ForegroundColor Green
        break
    }
    catch {
        if ($i -eq $maxRetries) {
            Write-Host "ERREUR: Impossible de copier l'EXE apres $maxRetries tentatives" -ForegroundColor Red
            Write-Host "Erreur: $_" -ForegroundColor Red
            exit 1
        }
        Write-Host "Tentative $i echouee, nouvelle tentative dans 2 secondes..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

# Robocopy exit codes: 0-7 sont des succès
if ($robocopyExitCode -le 7) {
    Write-Host "Copie terminee! (Code: $robocopyExitCode)" -ForegroundColor Green
} else {
    Write-Host "Avertissement: Robocopy code $robocopyExitCode (mais EXE copie)" -ForegroundColor Yellow
}

# 1. Générer d'abord le script InnoSetup avec les chemins corrects
Write-Host "Etape 1: Generation du script InnoSetup..." -ForegroundColor Cyan
& ".\generateInnoScript.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors de la generation du script" -ForegroundColor Red
    exit 1
}

# 2. Lancer InnoSetup
$innoSetupPath = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
$projectRoot = Split-Path -Parent $PSScriptRoot
$scriptPath = Join-Path -Path $projectRoot -ChildPath "InnoSetup Annexes\Script Setup LiBo2025.iss"

if (!(Test-Path $innoSetupPath)) {
    Write-Host "ERREUR: InnoSetup non trouve a $innoSetupPath" -ForegroundColor Red
    exit 1
}

Write-Host "Etape 2: Lancement InnoSetup..." -ForegroundColor Cyan
Write-Host "Script path: $scriptPath" -ForegroundColor Yellow

# Lancer Inno Setup avec le chemin correctement échappé
& $innoSetupPath """$scriptPath"""

if ($LASTEXITCODE -eq 0) {
    Write-Host "Setup cree avec succes sur le Desktop!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Erreur lors de la creation du Setup" -ForegroundColor Red
    exit $LASTEXITCODE
}
