/* Wohnungsplaner als Windows-App: zeigt die Online-Seite in einem eigenen Fenster.
   Updates der Seite kommen dadurch automatisch, die App selbst muss nicht neu gebaut werden. */
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

const SITE = 'https://tjorvencma.github.io/Wohnung-Info-/';

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let win = null;
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

  function isInternal(url) { return url.indexOf(SITE) === 0; }
  function openOutside(url) { if (/^https?:\/\//i.test(url)) shell.openExternal(url); }

  function createWindow() {
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
      width: 1280, height: 860, minWidth: 380, minHeight: 600,
      backgroundColor: '#F3EADA', title: 'Wohnungsplaner',
      icon: path.join(__dirname, 'build', 'icon.png'),
      autoHideMenuBar: true,
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: true }
    });
    /* Shop-Links, WhatsApp usw. öffnen im normalen Browser */
    win.webContents.setWindowOpenHandler(({ url }) => { openOutside(url); return { action: 'deny' }; });
    win.webContents.on('will-navigate', (e, url) => {
      if (!isInternal(url) && url.indexOf('file:') !== 0) { e.preventDefault(); openOutside(url); }
    });
    /* Keine Verbindung: eigene Hinweisseite mit Knopf zum erneuten Laden */
    win.webContents.on('did-fail-load', (e, code, desc, url, isMainFrame) => {
      if (isMainFrame && code !== -3 && isInternal(url)) win.loadFile(path.join(__dirname, 'offline.html'), { query: { u: SITE } });
    });
    win.on('closed', () => { win = null; });
    win.loadURL(SITE);
  }

  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => app.quit());
  app.on('activate', () => { if (!win) createWindow(); });
}
