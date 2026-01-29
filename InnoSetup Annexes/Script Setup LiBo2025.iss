; Script generated with static paths

#define MyAppName "LiBo2025"
#define MyAppVersion "1.3.0"
#define MyAppPublisher "Martin"
#define MyAppExeName "LiBo2025.exe"
#define BuildSourceDir "C:\Temp\LiBo2025-Build"
#define IconPath "C:\Users\Martin\HP Reboot -C-User-ComputerName-\LiBo2025 Code de Travail\LiBo2025\frontend\assets\Pumba.ico"

[Setup]
AppId={#MyAppName}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}

DefaultDirName={commonpf}\{#MyAppName}
DisableProgramGroupPage=yes

OutputDir="C:\Users\Martin\Desktop"
OutputBaseFilename=Setup LiBo2025 {#MyAppVersion}

SetupIconFile={#IconPath}
UninstallDisplayIcon={#IconPath}

Compression=zip
SolidCompression=no
UsePreviousAppDir=yes
DiskSpanning=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"

[Dirs]
Name: {app}; Permissions: users-full

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "{#BuildSourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs onlyifdoesntexist

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{#MyAppName}"

[Code]
function GetPreviousVersion(): String;
var
  sPrevVersion: String;
begin
  sPrevVersion := '';
  if RegKeyExists(HKEY_LOCAL_MACHINE, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{#MyAppName}') then
  begin
    if RegQueryStringValue(HKEY_LOCAL_MACHINE, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{#MyAppName}', 'DisplayVersion', sPrevVersion) then
    begin
      Result := sPrevVersion;
    end
    else
    begin
      Result := '';
    end;
  end
  else
  begin
    Result := '';
  end;
end;

procedure InitializeWizard();
var
  sPrevVersion: String;
begin
  sPrevVersion := GetPreviousVersion();
  if sPrevVersion <> '' then
  begin
    MsgBox('Version ' + sPrevVersion + ' detected.' + #13#13 +
           'The program will update your LiBo2025 installation.',
           mbInformation, MB_OK);
  end;
end;
