// ─────────────────────────────────────────────────────────────────────────
// Physical 65% keyboard layout used by the 3D hero board.
// Widths are in "u" units (1u = one alpha key). Every row totals 16u.
// `code` is the uiohook scan code so a cap can play its own sampled sound.
// ─────────────────────────────────────────────────────────────────────────

export type CapKind = 'alpha' | 'mod' | 'accent';

export interface Cap {
  /** Primary legend, printed bottom-left like a real doubleshot cap. */
  label: string;
  /** Optional shifted legend printed above the primary. */
  shift?: string;
  /** Width in u units. Defaults to 1. */
  w?: number;
  /** uiohook scan code — drives sound + stereo pan. */
  code: number;
  kind?: CapKind;
}

export const KEYBOARD_65: Cap[][] = [
  [
    { label: '`', shift: '~', code: 41, kind: 'mod' },
    { label: '1', shift: '!', code: 2 },
    { label: '2', shift: '@', code: 3 },
    { label: '3', shift: '#', code: 4 },
    { label: '4', shift: '$', code: 5 },
    { label: '5', shift: '%', code: 6 },
    { label: '6', shift: '^', code: 7 },
    { label: '7', shift: '&', code: 8 },
    { label: '8', shift: '*', code: 9 },
    { label: '9', shift: '(', code: 10 },
    { label: '0', shift: ')', code: 11 },
    { label: '-', shift: '_', code: 12 },
    { label: '=', shift: '+', code: 13 },
    { label: 'Bksp', w: 2, code: 14, kind: 'accent' },
    { label: 'Del', code: 14, kind: 'mod' },
  ],
  [
    { label: 'Tab', w: 1.5, code: 15, kind: 'mod' },
    { label: 'Q', code: 16 },
    { label: 'W', code: 17 },
    { label: 'E', code: 18 },
    { label: 'R', code: 19 },
    { label: 'T', code: 20 },
    { label: 'Y', code: 21 },
    { label: 'U', code: 22 },
    { label: 'I', code: 23 },
    { label: 'O', code: 24 },
    { label: 'P', code: 25 },
    { label: '[', shift: '{', code: 26 },
    { label: ']', shift: '}', code: 27 },
    { label: '\\', shift: '|', w: 1.5, code: 43, kind: 'mod' },
    { label: 'PgUp', code: 27, kind: 'mod' },
  ],
  [
    { label: 'Caps', w: 1.75, code: 58, kind: 'mod' },
    { label: 'A', code: 30 },
    { label: 'S', code: 31 },
    { label: 'D', code: 32 },
    { label: 'F', code: 33 },
    { label: 'G', code: 34 },
    { label: 'H', code: 35 },
    { label: 'J', code: 36 },
    { label: 'K', code: 37 },
    { label: 'L', code: 38 },
    { label: ';', shift: ':', code: 39 },
    { label: "'", shift: '"', code: 40 },
    { label: 'Enter', w: 2.25, code: 28, kind: 'accent' },
    { label: 'PgDn', code: 40, kind: 'mod' },
  ],
  [
    { label: 'Shift', w: 2.25, code: 42, kind: 'mod' },
    { label: 'Z', code: 44 },
    { label: 'X', code: 45 },
    { label: 'C', code: 46 },
    { label: 'V', code: 47 },
    { label: 'B', code: 48 },
    { label: 'N', code: 49 },
    { label: 'M', code: 50 },
    { label: ',', shift: '<', code: 51 },
    { label: '.', shift: '>', code: 52 },
    { label: '/', shift: '?', code: 53 },
    { label: 'Shift', w: 1.75, code: 54, kind: 'mod' },
    { label: '↑', code: 18, kind: 'mod' },
    { label: 'End', code: 40, kind: 'mod' },
  ],
  [
    { label: 'Ctrl', w: 1.25, code: 29, kind: 'mod' },
    { label: 'Win', w: 1.25, code: 56, kind: 'mod' },
    { label: 'Alt', w: 1.25, code: 56, kind: 'mod' },
    { label: '', w: 6.25, code: 57 },
    { label: 'Alt', code: 56, kind: 'mod' },
    { label: 'Fn', code: 3640, kind: 'mod' },
    { label: 'Ctrl', code: 3613, kind: 'mod' },
    { label: '←', code: 30, kind: 'mod' },
    { label: '↓', code: 46, kind: 'mod' },
    { label: '→', code: 36, kind: 'mod' },
  ],
];

/** Total width of every row, in u. */
export const ROW_UNITS = 16;
