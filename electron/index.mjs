import { app, BrowserWindow } from 'electron';
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
      },
    });

    const indexPath = path.join(app.getAppPath(), 'renderer', 'index.html');
    win.loadFile(indexPath);


    const win2 = new BrowserWindow({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      transparent: true,

    });


    // Spawn the OCR script.
    const python = spawn('python', [path.join(app.getAppPath(), 'python', 'live_ocr.py')]);

    python.stdout.on('data', (data) => {

      console.log(typeof data);

      console.log(`[OCR OUT]: ${data.toString()}`);

      // Send this to the renderer process.
      // win.webContents.send('ocr-output', data.toString());
    });

    python.stderr.on('data', (data) => {
      console.error(`[OCR ERR]: ${data.toString()}`);
    });

    python.on('close', (code) => {
      console.log(`OCR process exited with code ${code}`);
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
