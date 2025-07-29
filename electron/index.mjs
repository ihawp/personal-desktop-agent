import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { spawn } from 'child_process';

function createWindow() {

    const win = new BrowserWindow({
      width: 400,
      height: 600,
      x: 0,
      y: 0,
      transparent: false,
      frame: true,
      minimizable: true,
      closable: true,
      movable: true,
      alwaysOnTop: true,
      resizable: true,
      hasShadow: false,
      skipTaskbar: false,
      devTools: true,
      webPreferences: {
        preload: path.join(app.getAppPath(), 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: true,
      },
    });

    // Spawn the window.
    const indexPath = path.join(app.getAppPath(), 'renderer', 'index.html');
    win.loadFile(indexPath);

    // Spawn the OCR script.
    const python = spawn('python', [path.join(app.getAppPath(), 'python', 'live_ocr.py')]);

    python.stdout.on('data', (data) => {

      win.webContents.send('ocr-data', data.toString());

      console.log('data sent');

      // Send this to the renderer process.
      // win.webContents.send('ocr-output', data.toString());
    });

    python.stderr.on('data', (data) => {
      // log error.
    });

    python.on('close', (code) => {
      // log end of app life.
    });
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
