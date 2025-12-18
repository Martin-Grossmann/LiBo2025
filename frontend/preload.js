const { contextBridge, webFrame, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronZoom', {
  setZoom: (factor) => webFrame.setZoomFactor(factor)
});

// Expose isElectronApp pour la détection côté React
contextBridge.exposeInMainWorld('isElectronApp', true);

// Expose une fonction pour fermer la fenêtre Electron
contextBridge.exposeInMainWorld('closeElectronWindow', () => {
  ipcRenderer.send('close-electron-window');
});

// Expose fullscreen controls for the renderer to call native window fullscreen
contextBridge.exposeInMainWorld('electronAPI', {
  toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen'),
  setFullscreen: (flag) => ipcRenderer.send('set-fullscreen', !!flag)
});
