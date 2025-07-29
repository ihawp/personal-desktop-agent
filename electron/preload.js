const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onOCR: (callback) => ipcRenderer.on('ocr-data', (_event, value) => callback(value))
});