'use strict';
const { app, BrowserWindow, Menu, protocol, net, ipcMain, session } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');

const origin = 'rain://game';
const root = path.join(__dirname, 'game');
// A stable origin and profile keep saves independent of the portable EXE's temporary extraction path.
const testProfile = process.env.RAIN_DESKTOP_TEST_PROFILE;
const testing = Boolean(testProfile && process.argv.includes('--rain-test'));
app.setPath('userData', testing ? path.resolve(testProfile) : path.join(app.getPath('appData'), 'BeforeTheRain'));
protocol.registerSchemesAsPrivileged([{ scheme: 'rain', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
let window, fullscreen = false, normalBounds, maximizedBeforeFullscreen = false;
function status() { return { maximized: window.isMaximized(), fullscreen }; }
function setFullscreen(value) {
  if (value === fullscreen) return;
  if (value) { normalBounds = window.getNormalBounds(); maximizedBeforeFullscreen = window.isMaximized(); }
  window.setFullScreen(value);
  fullscreen = value;
  // Windows can omit the native fullscreen state for a window without WS_THICKFRAME.
  // Explicitly restore its size as well, so F11 and Esc always return to the previous window.
  if (!value && normalBounds) { window.setBounds(normalBounds); if (maximizedBeforeFullscreen) window.maximize(); }
  publish();
}
function trusted(event) {
  return window && !window.isDestroyed() && event.sender === window.webContents && event.senderFrame === window.webContents.mainFrame && event.senderFrame.url === origin + '/index.html';
}
function publish() { if (window && !window.isDestroyed()) window.webContents.send('rain:window-state', status()); }
if (!testing && !app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if (window) { if (window.isMinimized()) window.restore(); window.show(); window.focus(); } });
  app.whenReady().then(async () => {
    Menu.setApplicationMenu(null);
    protocol.handle('rain', request => {
      try {
        const url = new URL(request.url);
        if (request.method !== 'GET' || url.hostname !== 'game') return new Response('Not found', { status: 404 });
        const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
        const relative = path.relative(root, file);
        if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return new Response('Not found', { status: 404 });
        return net.fetch(pathToFileURL(file).href);
      } catch (_) { return new Response('Bad request', { status: 400 }); }
    });
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] }, (_details, callback) => callback({ cancel: true }));
    session.defaultSession.on('will-download', (_event, item) => {
      if (testing) { item.setSavePath(path.join(app.getPath('userData'), item.getFilename())); return; }
      item.setSaveDialogOptions({ title: '保存故事备份', defaultPath: path.join(app.getPath('downloads'), item.getFilename()) });
    });
    window = new BrowserWindow({
      width: 1440, height: 900, minWidth: 960, minHeight: 640,
      title: '雨停之前', backgroundColor: '#123337',
      frame: false, thickFrame: false, autoHideMenuBar: true, show: false,
      webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
    });
    window.setMenuBarVisibility(false);
    window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    window.webContents.on('will-navigate', (event, url) => { if (url !== origin + '/index.html') event.preventDefault(); });
    window.webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown' && input.key === 'F11' && !input.isAutoRepeat) { event.preventDefault(); setFullscreen(!fullscreen); }
      else if (input.type === 'keyDown' && input.key === 'Escape' && fullscreen) { event.preventDefault(); setFullscreen(false); }
    });
    for (const event of ['maximize', 'unmaximize']) window.on(event, publish);
    window.on('enter-full-screen', () => { fullscreen = true; publish(); });
    window.on('leave-full-screen', () => { fullscreen = false; publish(); });
    ipcMain.handle('rain:window-state', event => trusted(event) ? status() : null);
    for (const [command, action] of Object.entries({
      minimize: () => window.minimize(),
      fullscreen: () => setFullscreen(!fullscreen),
      maximize: () => { if (fullscreen) setFullscreen(false); else if (window.isMaximized()) window.unmaximize(); else window.maximize(); },
      close: () => window.close()
    })) ipcMain.on('rain:' + command, event => { if (trusted(event)) action(); });
    window.once('ready-to-show', () => { if (!testing) window.show(); });
    await window.loadURL(origin + '/index.html');
  }).catch(error => { console.error(error); app.exit(1); });
  app.on('window-all-closed', () => app.quit());
}
