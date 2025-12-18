// afterPack.js
// Ce script est appelé par electron-builder après le packaging
// Il lance le script PowerShell pour copier node_modules et injecte l'icône

const { execSync } = require('child_process');
const path = require('path');
const { rcedit } = require('rcedit');

exports.default = async function(context) {
  // 1. Copier node_modules via PowerShell
  const scriptPath = path.join(__dirname, 'postpack.ps1');
  try {
    execSync(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, { stdio: 'inherit' });
    console.log('Copie node_modules terminee.');
  } catch (err) {
    console.error('Erreur lors de la copie node_modules:', err.message);
    throw err;
  }

  // 2. Injecter l'icône Pumba.ico dans l'EXE avec rcedit
  const exePath = path.join(context.appOutDir, 'LiBo2025.exe');
  const iconPath = path.join(__dirname, 'assets', 'Pumba.ico');

  console.log('Injection icone: exePath=' + exePath);
  console.log('Injection icone: iconPath=' + iconPath);

  try {
    await rcedit(exePath, {
      icon: iconPath
    });
    console.log('Icone Pumba.ico injectee avec succes');
  } catch (err) {
    console.error('ERREUR RCEDIT:', err.message);
    console.error('Stack:', err.stack);
    throw err;
  }
};
