import { uIOhook } from 'uiohook-napi';
import { BrowserWindow } from 'electron';

let enabled = true;
let targetWindow: BrowserWindow | null = null;

/**
 * Initialise the global keyboard hook.
 * keydown/keyup events are forwarded to the renderer via IPC.
 */
export function setupKeyboardHook(window: BrowserWindow): void {
  targetWindow = window;

  uIOhook.on('keydown', (e) => {
    if (!enabled || !targetWindow || targetWindow.isDestroyed()) return;
    targetWindow.webContents.send('keystroke', {
      keycode: e.keycode,
      type: 'keydown',
      timestamp: Date.now(),
    });
  });

  uIOhook.on('keyup', (e) => {
    if (!enabled || !targetWindow || targetWindow.isDestroyed()) return;
    targetWindow.webContents.send('keystroke', {
      keycode: e.keycode,
      type: 'keyup',
      timestamp: Date.now(),
    });
  });

  uIOhook.start();
}

/** Toggle the hook on/off without tearing it down. */
export function setKeyboardEnabled(value: boolean): void {
  enabled = value;
}

/** Cleanly shut down the native hook. */
export function stopKeyboardHook(): void {
  try {
    uIOhook.stop();
  } catch {
    // Already stopped or never started — safe to ignore
  }
}
