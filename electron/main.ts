import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  globalShortcut,
  nativeImage,
  protocol,
  net,
  screen,
  shell,
} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { setupKeyboardHook, setKeyboardEnabled, stopKeyboardHook } from './keyboard-hook';
import { getSettings, saveSettings } from './settings';

const isProd = app.isPackaged;

// ── Custom protocol for serving renderer in production ──────────────────
if (isProd) {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'app',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
  ]);
}

// ── State ───────────────────────────────────────────────────────────────
let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

// ── Resolve crisp Logo icon ─────────────────────────────────────────────
function getAppIcon(): Electron.NativeImage {
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'assets', 'icon.png'),
    path.join(__dirname, '..', 'assets', 'icon.png'),
    path.join(process.resourcesPath, 'assets', 'icon.png'),
    path.join(process.resourcesPath, 'app.asar.unpacked', 'assets', 'icon.png'),
    path.join(app.getAppPath(), 'assets', 'icon.png'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      const img = nativeImage.createFromPath(p);
      if (!img.isEmpty()) {
        return img;
      }
    }
  }

  // Safe fallback
  return nativeImage.createEmpty();
}

// ── Window ──────────────────────────────────────────────────────────────
function createWindow(): void {
  const icon = getAppIcon();

  mainWindow = new BrowserWindow({
    width: 420,
    height: 700,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    icon: icon.isEmpty() ? undefined : icon,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false, // keep audio engine active when window hidden
    },
  });

  if (isProd) {
    mainWindow.loadURL('app://./app.html');
  } else {
    mainWindow.loadURL('http://localhost:3000/app');
  }

  // Hide on blur (standard tray popover behaviour)
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  // Intercept close → hide instead (stay in tray)
  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });
}

// ── Tray ────────────────────────────────────────────────────────────────
function createTray(): void {
  const appIcon = getAppIcon();
  
  // Tray icon resized cleanly for high-DPI Windows tray
  const trayIcon = appIcon.resize({ width: 24, height: 24 });
  tray = new Tray(trayIcon);
  tray.setToolTip('Mount — Mechanical Keyboard Sounds');

  // Left-click toggles the popover
  tray.on('click', toggleWindow);

  // Right-click context menu
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Mount Popover (Ctrl+Shift+K)', click: () => showWindow() },
    {
      label: 'Open Web Showcase',
      click: () => {
        shell.openExternal('http://localhost:3000');
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Mount',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}

// ── Popover positioning ─────────────────────────────────────────────────
function toggleWindow(): void {
  if (!mainWindow) return;
  mainWindow.isVisible() ? mainWindow.hide() : showWindow();
}

function showWindow(): void {
  if (!mainWindow || !tray) return;

  const trayBounds = tray.getBounds();
  const winBounds = mainWindow.getBounds();
  const display = screen.getDisplayMatching(trayBounds);
  const workArea = display.workArea;

  // Centre horizontally under tray icon
  let x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);
  let y = Math.round(trayBounds.y + trayBounds.height + 4);

  // Clamp within work area
  if (x + winBounds.width > workArea.x + workArea.width) {
    x = workArea.x + workArea.width - winBounds.width;
  }
  if (x < workArea.x) x = workArea.x;
  if (y + winBounds.height > workArea.y + workArea.height) {
    y = trayBounds.y - winBounds.height - 4; // flip above tray
  }

  mainWindow.setPosition(x, y, false);
  mainWindow.show();
  mainWindow.focus();
}

// ── IPC handlers ────────────────────────────────────────────────────────
function setupIPC(): void {
  ipcMain.handle('get-settings', () => getSettings());

  ipcMain.handle('save-settings', (_event, settings) => {
    saveSettings(settings);
    return true;
  });

  ipcMain.on('set-enabled', (_event, enabled: boolean) => {
    setKeyboardEnabled(enabled);
  });
}

// ── App lifecycle ───────────────────────────────────────────────────────
app.whenReady().then(() => {
  // Custom protocol handler (production)
  if (isProd) {
    const rendererDir = path.join(app.getAppPath(), 'renderer', 'out');
    protocol.handle('app', (request) => {
      const url = new URL(request.url);
      let filePath = decodeURIComponent(url.pathname);
      if (!filePath || filePath === '/' || filePath === '.') {
        filePath = '/app.html';
      }
      filePath = filePath.replace(/^\/+/, '');
      const fullPath = path.join(rendererDir, filePath);
      return net.fetch(`file:///${fullPath.replace(/\\/g, '/')}`);
    });
  }

  createWindow();
  createTray();
  setupIPC();

  if (mainWindow) {
    setupKeyboardHook(mainWindow);
  }

  // Global shortcut: Ctrl+Shift+K toggles popover
  globalShortcut.register('CommandOrControl+Shift+K', toggleWindow);
});

app.on('before-quit', () => {
  isQuitting = true;
  stopKeyboardHook();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Stay alive in the tray when all windows are "closed" (hidden)
app.on('window-all-closed', () => {
  /* no-op on purpose */
});

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => showWindow());
}
