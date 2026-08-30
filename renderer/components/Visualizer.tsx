'use client';

import { memo } from 'react';
import { keyboardLayout, getKeyName, keyWidths } from '@/lib/spatial-audio';

interface VisualizerProps {
  pressedKeys: Set<number>;
  accentColor: string;
}

export const Visualizer = memo(function Visualizer({
  pressedKeys,
  accentColor = '#00AFFF',
}: VisualizerProps) {
  return (
    <div className="px-5 py-2.5">
      <div className="flex items-center justify-between mb-2">
        <span className="label-md text-[#A1A1AA]">
          // SPATIAL_MATRIX
        </span>
        <span className="font-mono text-[10px] text-[#71717A]">
          STEREO_PANNED
        </span>
      </div>

      {/* Keyboard Matrix Container */}
      <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-2.5">
        <div className="flex flex-col gap-[3px]">
          {keyboardLayout.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-[3px] justify-center">
              {row.map((keycode) => (
                <KeyCap
                  key={keycode}
                  keycode={keycode}
                  isPressed={pressedKeys.has(keycode)}
                  accentColor={accentColor}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ── Neuform Technical Keycap ─────────────────────────────────────────

const KeyCap = memo(function KeyCap({
  keycode,
  isPressed,
  accentColor,
}: {
  keycode: number;
  isPressed: boolean;
  accentColor: string;
}) {
  const width = keyWidths[keycode] || 1;
  const label = getKeyName(keycode);

  return (
    <div
      className="flex items-center justify-center font-mono select-none transition-all duration-75 border"
      style={{
        width: `${width * 23}px`,
        height: '20px',
        flexShrink: 0,
        borderRadius: '2px',
        backgroundColor: isPressed ? (accentColor || '#00AFFF') : '#18181B',
        borderColor: isPressed ? (accentColor || '#00AFFF') : '#27272A',
        boxShadow: isPressed ? `0 0 10px ${accentColor || '#00AFFF'}88` : 'none',
        color: isPressed ? '#000000' : '#A1A1AA',
        fontSize: width > 1.8 ? '8px' : '9px',
        fontWeight: isPressed ? 700 : 500,
      }}
    >
      {label}
    </div>
  );
});
