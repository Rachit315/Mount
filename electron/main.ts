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
  systemPreferences,
} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { setupKeyboardHook, setKeyboardEnabled, stopKeyboardHook } from './keyboard-hook';
import { getSettings, saveSettings } from './settings';

const isProd = app.isPackaged;
const isMac = process.platform === 'darwin';

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
    // On Windows, hide from taskbar; on macOS, dock is hidden via app.dock.hide()
    skipTaskbar: !isMac,
    icon: icon.isEmpty() ? undefined : icon,
    // Matches the renderer's dark --bg so the window doesn't flash black
    // before the theme script runs.
    backgroundColor: '#212120',
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

  // Tray icon: 24×24 for Windows high-DPI, 18×18 for macOS menu bar
  const traySize = isMac ? 18 : 24;
  const trayIcon = appIcon.resize({ width: traySize, height: traySize });

  // On macOS, mark as template image so it adapts to dark/light menu bar
  if (isMac) {
    trayIcon.setTemplateImage(true);
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('Mount — Mechanical Keyboard Sounds');

  // Left-click toggles the popover
  tray.on('click', toggleWindow);

  // Platform-aware shortcut label
  const shortcutLabel = isMac ? '⌘+Shift+K' : 'Ctrl+Shift+K';

  // Right-click context menu
  const contextMenu = Menu.buildFromTemplate([
    { label: `Show Mount Popover (${shortcutLabel})`, click: () => showWindow() },
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

  // Centre horizontally under/over tray icon
  let x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);

  // On macOS, menu bar is at top → popover below tray icon
  // On Windows, taskbar is at bottom → popover above tray icon area
  let y: number;
  if (isMac) {
    // Position below the menu bar tray icon
    y = Math.round(trayBounds.y + trayBounds.height + 4);
    // If it overflows below, flip above
    if (y + winBounds.height > workArea.y + workArea.height) {
      y = trayBounds.y - winBounds.height - 4;
    }
  } else {
    // Windows: tray is near bottom, try to position above tray
    y = Math.round(trayBounds.y + trayBounds.height + 4);
    // If it overflows below the work area, flip above the tray
    if (y + winBounds.height > workArea.y + workArea.height) {
      y = trayBounds.y - winBounds.height - 4;
    }
  }

  // Clamp horizontal position within work area
  if (x + winBounds.width > workArea.x + workArea.width) {
    x = workArea.x + workArea.width - winBounds.width;
  }
  if (x < workArea.x) x = workArea.x;

  mainWindow.setPosition(x, y, false);
  mainWindow.show();
  mainWindow.focus();
}

// ── macOS Accessibility permission check ────────────────────────────────
function checkAccessibilityPermission(): boolean {
  if (!isMac) return true; // Not needed on Windows
  return systemPreferences.isTrustedAccessibilityClient(false);
}

function requestAccessibilityPermission(): boolean {
  if (!isMac) return true;
  // Passing `true` prompts the user with the macOS permission dialog
  return systemPreferences.isTrustedAccessibilityClient(true);
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

  // Cross-platform helpers
  ipcMain.handle('get-platform', () => process.platform);

  ipcMain.handle('check-accessibility', () => checkAccessibilityPermission());

  ipcMain.handle('request-accessibility', () => requestAccessibilityPermission());
}

// ── App lifecycle ───────────────────────────────────────────────────────
app.whenReady().then(() => {
  // On macOS, hide dock icon — Mount is a menu bar–only app
  if (isMac && app.dock) {
    app.dock.hide();
  }

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

  // Global shortcut: Ctrl+Shift+K (Win) / ⌘+Shift+K (Mac) toggles popover
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
  /* no-op on purpose — app stays in tray/menu bar */
});

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => showWindow());
}
