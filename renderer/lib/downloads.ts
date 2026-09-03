// ─────────────────────────────────────────────────────────────────────────
// Release downloads.
//
// Every URL points at `releases/latest/download/...`, which GitHub resolves to
// the newest published release. Tagging a new version therefore updates these
// links with no code change here.
// ─────────────────────────────────────────────────────────────────────────

const RELEASE_BASE = 'https://github.com/Rachit315/Mount/releases/latest/download';

export const RELEASES_PAGE = 'https://github.com/Rachit315/Mount/releases';
export const APP_VERSION = '2.1.0';

export type PlatformId = 'windows' | 'mac-arm64' | 'mac-x64';
export type PlatformFamily = 'windows' | 'mac' | 'unknown';

export interface DownloadTarget {
  id: PlatformId;
  family: PlatformFamily;
  /** Shown on the button. */
  label: string;
  /** Disambiguates the two Mac builds in lists. */
  subtitle: string;
  fileName: string;
  url: string;
}

export const DOWNLOADS: Record<PlatformId, DownloadTarget> = {
  windows: {
    id: 'windows',
    family: 'windows',
    label: 'Download for Windows',
    subtitle: 'Windows 10/11 · 64-bit · portable',
    fileName: 'Mount-Windows-x64.zip',
    url: `${RELEASE_BASE}/Mount-Windows-x64.zip`,
  },
  'mac-arm64': {
    id: 'mac-arm64',
    family: 'mac',
    label: 'Download for macOS',
    subtitle: 'Apple Silicon · M1 and newer',
    fileName: 'Mount-macOS-arm64.zip',
    url: `${RELEASE_BASE}/Mount-macOS-arm64.zip`,
  },
  'mac-x64': {
    id: 'mac-x64',
    family: 'mac',
    label: 'Download for macOS',
    subtitle: 'Intel Mac',
    fileName: 'Mount-macOS-x64.zip',
    url: `${RELEASE_BASE}/Mount-macOS-x64.zip`,
  },
};

export const MAC_TARGETS: DownloadTarget[] = [
  DOWNLOADS['mac-arm64'],
  DOWNLOADS['mac-x64'],
];

/**
 * Best guess at the visitor's platform, used only to decide which download to
 * put first. Every option stays reachable regardless of what this returns.
 *
 * Apple Silicon vs Intel can't be read directly from the browser, so we lean on
 * the WebGL renderer string — Apple's own GPUs report "Apple ...". When that is
 * unavailable we assume Apple Silicon, which is the far more common Mac today.
 */
export function detectPlatform(): PlatformId | null {
  if (typeof navigator === 'undefined') return null;

  const ua = navigator.userAgent;
  const platform = navigator.platform || '';

  const isMac = /Mac|iPhone|iPad|iPod/i.test(ua) || /Mac/i.test(platform);
  if (isMac) return isAppleSilicon() ? 'mac-arm64' : 'mac-x64';

  if (/Win/i.test(ua) || /Win/i.test(platform)) return 'windows';

  return null;
}

function isAppleSilicon(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return true;

    const info = gl.getExtension('WEBGL_debug_renderer_info');
    if (!info) return true;

    const renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
    // Intel Macs report an Intel or AMD/Radeon GPU here.
    if (/Intel|AMD|Radeon/i.test(renderer)) return false;
    return true;
  } catch {
    return true;
  }
}

export function familyOf(id: PlatformId | null): PlatformFamily {
  if (!id) return 'unknown';
  return DOWNLOADS[id].family;
}

/** Install steps, which differ meaningfully between the two platforms. */
export const INSTALL_STEPS: Record<PlatformFamily, string[]> = {
  windows: [
    'Download and extract Mount-Windows-x64.zip anywhere on your PC.',
    'Run Mount.exe — it drops straight into your system tray.',
    'Press Ctrl + Shift + K any time to open the panel.',
  ],
  mac: [
    'Download and unzip, then drag Mount.app into your Applications folder.',
    'The build is unsigned, so the first launch needs a right-click (or Control-click) on the app and then Open — double-clicking will be blocked.',
    'Grant Accessibility permission when prompted: System Settings → Privacy & Security → Accessibility. Mount needs it to hear keystrokes system-wide.',
    'Press ⌘ + Shift + K any time to open the panel.',
  ],
  unknown: [],
};

/** Shown alongside the macOS download so the Gatekeeper prompt isn't a surprise. */
export const MAC_GATEKEEPER_NOTE =
  'Mount is not yet notarised by Apple, so macOS will warn you the first time. Right-click the app and choose Open to get past it.';

export const MAC_QUARANTINE_COMMAND =
  'xattr -dr com.apple.quarantine /Applications/Mount.app';
