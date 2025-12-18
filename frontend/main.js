
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Lancer le backend Node.js (server.js) au démarrage d'Electron
let backendProcess;

// Détection du mode développement (npm run electron) ou build (EXE)
function isDev() {
  return process.env.NODE_ENV === 'development' || process.defaultApp || /[\\/]electron[.]/.test(process.execPath);
}

let mainWindow;
function createWindow () {
  const zoomFactor = 0.6;
  const baseWidth = 1280;
  const baseHeight = 800;

  const win = new BrowserWindow({
    width: Math.round(baseWidth / zoomFactor),
    height: Math.round(baseHeight / zoomFactor),
    resizable: true,
    fullscreen: true,
    icon: path.join(__dirname, 'assets', 'Pumba.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });



  // Indique au frontend qu'on est sous Electron
  win.webContents.executeJavaScript('window.isElectronApp = true;');
  win.loadFile(path.join(__dirname, 'build', 'index.html'));
  mainWindow = win;
  // Forcer le zoom du contenu pour EXE et dev
  win.webContents.on('did-finish-load', () => {
    win.webContents.setZoomFactor(zoomFactor);
  });

  // Ajout d'un raccourci clavier pour ouvrir DevTools manuellement
  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      win.webContents.openDevTools();
    }
    // Sortir du plein écran avec la touche Esc
    if (input.key.toLowerCase() === 'escape' && win.isFullScreen()) {
      win.setFullScreen(false);
    }
  });
  
  // Lancer le backend SANS bloquer l'UI
  let backendPath, nodePath;
  if (isDev()) {
    backendPath = path.resolve(__dirname, '..', 'backend', 'server.js');
    nodePath = 'node'; // En développement, node est dans le PATH
  } else {
    const appPath = app.getAppPath();
    backendPath = path.join(appPath, 'backend', 'server.js');
    nodePath = path.join(appPath, 'backend', 'node.exe'); // En production, node.exe est copié dans backend/
  }
  
  backendProcess = spawn(nodePath, [backendPath], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true
  });
  backendProcess.unref();
}

// Arrêter le backend quand Electron se ferme
app.on('will-quit', () => {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
});


// Listener IPC pour fermer la fenêtre principale
ipcMain.on('close-electron-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Handle fullscreen IPC messages from renderer
ipcMain.on('toggle-fullscreen', () => {
  if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

ipcMain.on('set-fullscreen', (event, flag) => {
  if (mainWindow) mainWindow.setFullScreen(Boolean(flag));
});

app.whenReady().then(createWindow);
