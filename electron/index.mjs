import { app, BrowserWindow } from 'electron';
import path from 'node:path';

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    x: 0,
    y: 0,
    transparent: true,
    frame: true,
    minimizable: true,
    closable: true,
    movable: true,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: false,
    devTools: true,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    // For prod environment.
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
    win.loadFile(indexPath);
  } else {
    // For dev environment.
    const indexPath = path.join(app.getAppPath(), '../', 'electron-frontend', 'dist', 'index.html');
    win.loadFile(indexPath);
  }
}

app.setAsDefaultProtocolClient('ihawp');
app.setAppUserModelId('com.ihawp.AiCrap');

app.whenReady().then(() => {
    createWindow();

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
