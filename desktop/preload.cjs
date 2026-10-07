'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('RainDesktop', {
  minimize: () => ipcRenderer.send('rain:minimize'),
  maximize: () => ipcRenderer.send('rain:maximize'),
  fullscreen: () => ipcRenderer.send('rain:fullscreen'),
  close: () => ipcRenderer.send('rain:close'),
  state: () => ipcRenderer.invoke('rain:window-state'),
  onState: callback => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('rain:window-state', listener);
    return () => ipcRenderer.removeListener('rain:window-state', listener);
  }
});
