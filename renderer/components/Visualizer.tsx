'use client';

import { memo } from 'react';
import { keyboardLayout, getKeyName, keyWidths } from '@/lib/spatial-audio';

interface VisualizerProps {
  pressedKeys: Set<number>;
  accentColor: string;
  /** Base key size in px. */
  unit?: number;
  label?: string;
  /** Hide the built-in caption when the parent already labels the block. */
  showHeader?: boolean;
}

/**
 * Compact keycap matrix. Caps carry the same cream/tan treatment as the hero
 * board, and light up in the active profile's colour when struck.
 */
export const Visualizer = memo(function Visualizer({
  pressedKeys,
  accentColor,
  unit = 24,
  label = 'Key matrix',
  showHeader = true,
}: VisualizerProps) {
  const gap = Math.max(2, unit * 0.11);

  return (
    <div className={showHeader ? 'px-4 py-3' : 'p-2'}>
      {showHeader && (
        <div className="mb-2.5 flex items-center justify-between">
          <span className="label-md">{label}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-content-3">
            Stereo panned
          </span>
        </div>
      )}

      <div
        className="rounded-md p-2.5"
        style={{
          background:
            'linear-gradient(170deg, var(--case-top), var(--case) 60%, color-mix(in srgb, var(--case) 84%, black))',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.28) inset, 0 -2px 5px rgba(0,0,0,0.12) inset, var(--shadow-sm)',
        }}
      >
        <div className="flex flex-col" style={{ gap }}>
          {keyboardLayout.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex justify-center"
              style={{ gap }}
            >
              {row.map((keycode) => (
                <MatrixCap
                  key={keycode}
                  keycode={keycode}
                  isPressed={pressedKeys.has(keycode)}
                  accentColor={accentColor}
                  unit={unit}
                  gap={gap}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const MOD_CODES = new Set([1, 14, 15, 43, 58, 28, 42, 54, 29, 56]);

const MatrixCap = memo(function MatrixCap({
  keycode,
  isPressed,
  accentColor,
  unit,
  gap,
}: {
  keycode: number;
  isPressed: boolean;
  accentColor: string;
  unit: number;
  gap: number;
}) {
  const w = keyWidths[keycode] || 1;
  const label = getKeyName(keycode);
  const width = unit * w + gap * (w - 1);

  return (
    <div
      className="keycap items-center justify-center"
      data-mod={MOD_CODES.has(keycode) || undefined}
      data-pressed={isPressed || undefined}
      style={{
        width,
        height: unit * 0.86,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        borderRadius: 4,
        fontSize: w > 1.8 ? unit * 0.3 : unit * 0.36,
        fontWeight: 600,
        ...(isPressed
          ? {
              background: `linear-gradient(180deg, ${accentColor}, color-mix(in srgb, ${accentColor} 78%, black))`,
              color: '#fff',
            }
          : null),
      }}
    >
      {label}
    </div>
  );
});
