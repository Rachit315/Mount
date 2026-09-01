import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export interface MountSettings {
  enabled: boolean;
  volume: number;
  toneX: number;
  pitchY: number;
  selectedProfile: string;
  /** Lifetime keystrokes, carried across restarts. */
  keystrokeCount: number;
}

const defaultSettings: MountSettings = {
  enabled: true,
  volume: 0.8,
  toneX: 0.5,
  pitchY: 0.5,
  selectedProfile: 'alpaca',
  keystrokeCount: 0,
};

function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'mount-settings.json');
}

/** Read settings from disk, falling back to defaults for missing keys. */
export function getSettings(): MountSettings {
  try {
    const raw = fs.readFileSync(getSettingsPath(), 'utf-8');
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}

/** Merge partial settings into the saved file. */
export function saveSettings(settings: Partial<MountSettings>): void {
  const current = getSettings();
  const merged = { ...current, ...settings };
  const dir = path.dirname(getSettingsPath());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(getSettingsPath(), JSON.stringify(merged, null, 2));
}
