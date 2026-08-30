/* ── Type declarations for the Electron ↔ Renderer bridge ────────────── */

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
}

export interface MountAPI {
  onKeystroke: (callback: (event: KeystrokeEvent) => void) => () => void;
  setEnabled: (enabled: boolean) => void;
  getSettings: () => Promise<MountSettings>;
  saveSettings: (settings: MountSettings) => Promise<void>;
}

declare global {
  interface Window {
    mount?: MountAPI;
  }
}
