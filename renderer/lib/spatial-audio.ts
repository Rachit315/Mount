// ─────────────────────────────────────────────────────────────────────────
// Spatial audio: map uiohook key codes → stereo pan values
// ─────────────────────────────────────────────────────────────────────────

/**
 * Horizontal position of each key on a standard US QWERTY layout.
 * 0 = far left, 1 = far right.
 * Keys are identified by uiohook scan codes.
 */
const keyPositions: Record<number, number> = {
  // Escape + Number row (scan codes 1–14)
  1: 0.02, 2: 0.08, 3: 0.14, 4: 0.20, 5: 0.26, 6: 0.32,
  7: 0.38, 8: 0.44, 9: 0.50, 10: 0.56, 11: 0.62, 12: 0.68,
  13: 0.74, 14: 0.82,

  // Tab + QWERTY row (15–27)
  15: 0.05, 16: 0.12, 17: 0.18, 18: 0.24, 19: 0.30, 20: 0.36,
  21: 0.42, 22: 0.48, 23: 0.54, 24: 0.60, 25: 0.66, 26: 0.72,
  27: 0.78,

  // CapsLock + Home row (58, 30–40, 28)
  58: 0.04, 30: 0.14, 31: 0.20, 32: 0.26, 33: 0.32, 34: 0.38,
  35: 0.44, 36: 0.50, 37: 0.56, 38: 0.62, 39: 0.68, 40: 0.74,
  28: 0.86,

  // Shifts + Bottom row (42, 44–53, 54)
  42: 0.06, 44: 0.18, 45: 0.24, 46: 0.30, 47: 0.36, 48: 0.42,
  49: 0.48, 50: 0.54, 51: 0.60, 52: 0.66, 53: 0.72, 54: 0.88,

  // Backslash
  43: 0.84,

  // Bottom modifiers + space
  29: 0.04, 56: 0.12, 57: 0.50, 3640: 0.80, 3613: 0.90,

  // Backquote
  41: 0.02,
};

/**
 * Returns a stereo pan value (−1 … +1) for the given uiohook keycode.
 * Left side of keyboard → negative, right → positive, centre → 0.
 */
export function getKeyPan(keycode: number): number {
  const pos = keyPositions[keycode];
  if (pos === undefined) return 0;
  // Map 0…1 → −0.7…+0.7  (leave headroom)
  return (pos - 0.5) * 1.4;
}

/** Human-readable label for each key (for the visualizer). */
export function getKeyName(keycode: number): string {
  const names: Record<number, string> = {
    1: 'ESC', 2: '1', 3: '2', 4: '3', 5: '4', 6: '5',
    7: '6', 8: '7', 9: '8', 10: '9', 11: '0', 12: '-',
    13: '=', 14: '⌫', 15: 'TAB',
    16: 'Q', 17: 'W', 18: 'E', 19: 'R', 20: 'T', 21: 'Y',
    22: 'U', 23: 'I', 24: 'O', 25: 'P', 26: '[', 27: ']',
    28: '↵', 29: 'CTRL',
    30: 'A', 31: 'S', 32: 'D', 33: 'F', 34: 'G', 35: 'H',
    36: 'J', 37: 'K', 38: 'L', 39: ';', 40: "'",
    41: '`', 42: 'SHIFT', 43: '\\',
    44: 'Z', 45: 'X', 46: 'C', 47: 'V', 48: 'B', 49: 'N',
    50: 'M', 51: ',', 52: '.', 53: '/',
    54: 'SHIFT', 56: 'ALT', 57: 'SPACE', 58: 'CAPS',
  };
  return names[keycode] || '·';
}

/**
 * Keyboard rows for the visualizer component.
 * Each inner array is a list of uiohook scan codes, left to right.
 */
export const keyboardLayout: number[][] = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],        // Number row
  [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 43], // QWERTY row
  [58, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 28],     // Home row
  [42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],          // Bottom row
  [29, 56, 57],                                                // Space row
];

/** Key widths in "u" units (1u = standard key). */
export const keyWidths: Record<number, number> = {
  14: 2.0,   // Backspace
  15: 1.5,   // Tab
  43: 1.5,   // Backslash
  58: 1.75,  // CapsLock
  28: 2.25,  // Enter
  42: 2.25,  // Left Shift
  54: 2.75,  // Right Shift
  29: 1.25,  // Left Ctrl
  56: 1.25,  // Left Alt
  57: 6.25,  // Space
};

/**
 * Map browser KeyboardEvent.code → uiohook scan code.
 * Used as a fallback when running outside Electron.
 */
export const webKeyToScanCode: Record<string, number> = {
  Escape: 1, Digit1: 2, Digit2: 3, Digit3: 4, Digit4: 5,
  Digit5: 6, Digit6: 7, Digit7: 8, Digit8: 9, Digit9: 10,
  Digit0: 11, Minus: 12, Equal: 13, Backspace: 14, Tab: 15,
  KeyQ: 16, KeyW: 17, KeyE: 18, KeyR: 19, KeyT: 20,
  KeyY: 21, KeyU: 22, KeyI: 23, KeyO: 24, KeyP: 25,
  BracketLeft: 26, BracketRight: 27, Enter: 28, ControlLeft: 29,
  KeyA: 30, KeyS: 31, KeyD: 32, KeyF: 33, KeyG: 34,
  KeyH: 35, KeyJ: 36, KeyK: 37, KeyL: 38, Semicolon: 39,
  Quote: 40, Backquote: 41, ShiftLeft: 42, Backslash: 43,
  KeyZ: 44, KeyX: 45, KeyC: 46, KeyV: 47, KeyB: 48,
  KeyN: 49, KeyM: 50, Comma: 51, Period: 52, Slash: 53,
  ShiftRight: 54, AltLeft: 56, Space: 57, CapsLock: 58,
  ArrowLeft: 30, ArrowUp: 18, ArrowRight: 36, ArrowDown: 46,
  AltRight: 56, ControlRight: 29, MetaLeft: 29, MetaRight: 29,
};
