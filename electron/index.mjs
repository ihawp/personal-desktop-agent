import { app, BrowserWindow, MessageChannelMain } from 'electron';
import path from 'node:path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

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

    // Create a MessageChannel equivalent.
    const { port1, port2 } = new MessageChannelMain();

    // Keep port 2 here for sending messages between the processes 
      // without interupting the main thread.
    port2.postMessage({ success: true });

    win.once('ready-to-show', () => {
      win.webContents.postMessage('port', null, [port2]);
    });

    port1.on('message', (event) => {
      console.log({ event });
    });

    // Load the React frontend to the BrowserWindow.
    const indexPath = path.join(app.getAppPath(), 'renderer', 'index.html');
    win.loadFile(indexPath);

    // Spawn the non-malicious keylogger.
    /*
    const keylogger = spawn('python', [path.join(app.getAppPath(), 'python', 'key_logger.py')]);

    keylogger.stdout.on('data', (data) => {
      console.log('this is keylogged', data);
    });

    keylogger.stderr.on('data', (data) => {
      // log error.
      console.log('keylogger error', data);
    });

    keylogger.on('close', (code) => {
      // log end of script life.
      console.log('Keylogged closed.', code);
    });
    */

    // Spawn the OCR script.
    /*
    const ocr = spawn('python', [path.join(app.getAppPath(), 'python', 'live_ocr.py')], {
      env: process.env,
    });

    ocr.stdout.on('data', (data) => {

      win.webContents.send('ocr-data', data.toString());

      console.log('data sent');

    });

    ocr.stderr.on('data', (data) => {
      // log error.
      console.log('ocr error', data);
    });

    ocr.on('close', (code) => {
      // log end of script life.
      console.log('ocr closed.', code);
    });
    */
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
