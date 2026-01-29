# Script pour générer le script InnoSetup avec chemins dynamiques
# Utilise $PSScriptRoot pour éviter les hardcodes

# Déterminer le répertoire du script (frontend)
$scriptDir = $PSScriptRoot
$projectRoot = Split-Path -Parent $scriptDir

# Chemins dynamiques - utiliser un dossier temporaire dans C:\Temp
$tempRootDir = "C:\Temp"
if (!(Test-Path $tempRootDir)) {
    New-Item -ItemType Directory -Path $tempRootDir -Force | Out-Null
}
$buildDir = Join-Path -Path $tempRootDir -ChildPath "LiBo2025-Build"
$iconPath = Join-Path -Path $scriptDir -ChildPath "assets\Pumba.ico"
$desktopDir = [Environment]::GetFolderPath('Desktop')
$outputScript = Join-Path -Path $projectRoot -ChildPath "InnoSetup Annexes\Script Setup LiBo2025.iss"

Write-Host "Génération du script InnoSetup..."
Write-Host "Build Dir: $buildDir"
Write-Host "Icon Path: $iconPath"
Write-Host "Output: $outputScript"

# Vérifier que le dossier de build existe
if (!(Test-Path $buildDir)) {
    Write-Host "ERREUR: Dossier de build non trouve: $buildDir" -ForegroundColor Red
    exit 1
}

# Vérifier que l'icône existe
if (!(Test-Path $iconPath)) {
    Write-Host "ERREUR: Icone non trouvee: $iconPath" -ForegroundColor Red
    exit 1
}

# Générer le script InnoSetup
$LBRACE = "{"
$RBRACE = "}"
$scriptContent = "; Script generated with static paths`r`n"
$scriptContent += "`r`n"
$scriptContent += "#define MyAppName `"LiBo2025`"`r`n"
$scriptContent += "#define MyAppVersion `"1.3.0`"`r`n"
$scriptContent += "#define MyAppPublisher `"Martin`"`r`n"
$scriptContent += "#define MyAppExeName `"LiBo2025.exe`"`r`n"
$scriptContent += "#define BuildSourceDir `"$buildDir`"`r`n"
$scriptContent += "#define IconPath `"$iconPath`"`r`n"
$scriptContent += "`r`n"
$scriptContent += "[Setup]`r`n"
$scriptContent += "AppId=$($LBRACE)#MyAppName$($RBRACE)`r`n"
$scriptContent += "AppName=$($LBRACE)#MyAppName$($RBRACE)`r`n"
$scriptContent += "AppVersion=$($LBRACE)#MyAppVersion$($RBRACE)`r`n"
$scriptContent += "AppPublisher=$($LBRACE)#MyAppPublisher$($RBRACE)`r`n"
$scriptContent += "`r`n"
$scriptContent += "DefaultDirName=$($LBRACE)commonpf$($RBRACE)\$($LBRACE)#MyAppName$($RBRACE)`r`n"
$scriptContent += "DisableProgramGroupPage=yes`r`n"
$scriptContent += "`r`n"
$scriptContent += "OutputDir=`"$desktopDir`"`r`n"
$scriptContent += "OutputBaseFilename=Setup LiBo2025 $($LBRACE)#MyAppVersion$($RBRACE)`r`n"
$scriptContent += "`r`n"
$scriptContent += "SetupIconFile={#IconPath}`r`n"
$scriptContent += "UninstallDisplayIcon={#IconPath}`r`n"
$scriptContent += "`r`n"
$scriptContent += "Compression=zip`r`n"
$scriptContent += "SolidCompression=no`r`n"
$scriptContent += "UsePreviousAppDir=yes`r`n"
$scriptContent += "DiskSpanning=yes`r`n"
$scriptContent += "`r`n"
$scriptContent += "[Languages]`r`n"
$scriptContent += "Name: `"english`"; MessagesFile: `"compiler:Default.isl`"`r`n"
$scriptContent += "Name: `"french`"; MessagesFile: `"compiler:Languages\French.isl`"`r`n"
$scriptContent += "`r`n"
$scriptContent += "[Dirs]`r`n"
$scriptContent += "Name: $($LBRACE)app$($RBRACE); Permissions: users-full`r`n"
$scriptContent += "`r`n"
$scriptContent += "[Tasks]`r`n"
$scriptContent += "Name: `"desktopicon`"; Description: `"$($LBRACE)cm:CreateDesktopIcon$($RBRACE)`"; GroupDescription: `"$($LBRACE)cm:AdditionalIcons$($RBRACE)`"; Flags: unchecked`r`n"
$scriptContent += "`r`n"
$scriptContent += "[Files]`r`n"
# Utiliser la variable définie au lieu du chemin direct
$scriptContent += "Source: `"{#BuildSourceDir}\*`"; DestDir: `"{app}`"; Flags: ignoreversion recursesubdirs createallsubdirs onlyifdoesntexist`r`n"
$scriptContent += "`r`n"
$scriptContent += "[Icons]`r`n"
$scriptContent += "Name: `"$($LBRACE)commonprograms$($RBRACE)\$($LBRACE)#MyAppName$($RBRACE)`"; Filename: `"$($LBRACE)app$($RBRACE)\$($LBRACE)#MyAppExeName$($RBRACE)`"`r`n"
$scriptContent += "Name: `"$($LBRACE)commondesktop$($RBRACE)\$($LBRACE)#MyAppName$($RBRACE)`"; Filename: `"$($LBRACE)app$($RBRACE)\$($LBRACE)#MyAppExeName$($RBRACE)`"; Tasks: desktopicon`r`n"
$scriptContent += "`r`n"
$scriptContent += "[Run]`r`n"
$scriptContent += "Filename: `"$($LBRACE)app$($RBRACE)\$($LBRACE)#MyAppExeName$($RBRACE)`"; Description: `"$($LBRACE)cm:LaunchProgram,$($LBRACE)#StringChange(MyAppName, '&', '&&')$($RBRACE)$($RBRACE)`"; Flags: nowait postinstall skipifsilent`r`n"
$scriptContent += "`r`n"
$scriptContent += "[UninstallDelete]`r`n"
$scriptContent += "Type: filesandordirs; Name: `"$($LBRACE)#MyAppName$($RBRACE)`"`r`n"
$scriptContent += "`r`n"
$scriptContent += "[Code]`r`n"
$scriptContent += "function GetPreviousVersion(): String;`r`n"
$scriptContent += "var`r`n"
$scriptContent += "  sPrevVersion: String;`r`n"
$scriptContent += "begin`r`n"
$scriptContent += "  sPrevVersion := '';`r`n"
$scriptContent += "  if RegKeyExists(HKEY_LOCAL_MACHINE, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\$($LBRACE)#MyAppName$($RBRACE)') then`r`n"
$scriptContent += "  begin`r`n"
$scriptContent += "    if RegQueryStringValue(HKEY_LOCAL_MACHINE, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\$($LBRACE)#MyAppName$($RBRACE)', 'DisplayVersion', sPrevVersion) then`r`n"
$scriptContent += "    begin`r`n"
$scriptContent += "      Result := sPrevVersion;`r`n"
$scriptContent += "    end`r`n"
$scriptContent += "    else`r`n"
$scriptContent += "    begin`r`n"
$scriptContent += "      Result := '';`r`n"
$scriptContent += "    end;`r`n"
$scriptContent += "  end`r`n"
$scriptContent += "  else`r`n"
$scriptContent += "  begin`r`n"
$scriptContent += "    Result := '';`r`n"
$scriptContent += "  end;`r`n"
$scriptContent += "end;`r`n"
$scriptContent += "`r`n"
$scriptContent += "procedure InitializeWizard();`r`n"
$scriptContent += "var`r`n"
$scriptContent += "  sPrevVersion: String;`r`n"
$scriptContent += "begin`r`n"
$scriptContent += "  sPrevVersion := GetPreviousVersion();`r`n"
$scriptContent += "  if sPrevVersion <> '' then`r`n"
$scriptContent += "  begin`r`n"
$scriptContent += "    MsgBox('Version ' + sPrevVersion + ' detected.' + #13#13 +`r`n"
$scriptContent += "           'The program will update your LiBo2025 installation.',`r`n"
$scriptContent += "           mbInformation, MB_OK);`r`n"
$scriptContent += "  end;`r`n"
$scriptContent += "end;`r`n"

# Écrire le script
try {
    # Utiliser UTF-8 sans BOM (encodage standard pour Inno Setup)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($outputScript, $scriptContent, $utf8NoBom)
    Write-Host "Script InnoSetup genere avec succes: $outputScript" -ForegroundColor Green
    exit 0
}
catch {
    Write-Host "ERREUR lors de la generation: $_" -ForegroundColor Red
    exit 1
}
