import { contextBridge, ipcRenderer } from 'electron';

export interface KeystrokeEvent {
  keycode: number;
  type: 'keydown' | 'keyup';
  timestamp: number;
}

export interface MountSettings {
  enabled: boolean;
  volume: number;
  toneX: number;
  pitchY: number;
  selectedProfile: string;
  keystrokeCount: number;
}

contextBridge.exposeInMainWorld('mount', {
  /**
   * Subscribe to global keystroke events forwarded from the native hook.
   * Returns an unsubscribe function.
   */
  onKeystroke: (callback: (event: KeystrokeEvent) => void) => {
    const handler = (_ipcEvent: Electron.IpcRendererEvent, data: KeystrokeEvent) =>
      callback(data);
    ipcRenderer.on('keystroke', handler);
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('keystroke', handler);
    };
  },

  /** Tell the main process to enable/disable keyboard capture. */
  setEnabled: (enabled: boolean) => {
    ipcRenderer.send('set-enabled', enabled);
  },

  /** Read persisted settings from disk. */
  getSettings: (): Promise<MountSettings> => {
    return ipcRenderer.invoke('get-settings');
  },

  /** Persist settings to disk. Partial updates merge into the saved file. */
  saveSettings: (settings: Partial<MountSettings>): Promise<void> => {
    return ipcRenderer.invoke('save-settings', settings);
  },

  /** Get the current platform: 'darwin' | 'win32' | 'linux'. */
  getPlatform: (): Promise<string> => {
    return ipcRenderer.invoke('get-platform');
  },

  /** Check if macOS Accessibility permission is granted. Always returns true on non-macOS. */
  checkAccessibility: (): Promise<boolean> => {
    return ipcRenderer.invoke('check-accessibility');
  },

  /** Request macOS Accessibility permission (opens system dialog). Always returns true on non-macOS. */
  requestAccessibility: (): Promise<boolean> => {
    return ipcRenderer.invoke('request-accessibility');
  },
});

