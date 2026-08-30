'use client';

import { useRef, useState, useCallback } from 'react';

interface TonePitchPadProps {
  toneX: number;  // 0 (thock) → 1 (clack)
  pitchY: number; // 0 (deep) → 1 (sharp)
  onChange: (toneX: number, pitchY: number) => void;
}

export function TonePitchPad({ toneX, pitchY, onChange }: TonePitchPadProps) {
  const padRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateFromPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!padRef.current) return;
      const rect = padRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
      onChange(x, y);
    },
    [onChange],
  );

  return (
    <div className="px-5 py-2.5">
      <div className="flex items-center justify-between mb-2">
        <span className="label-md text-[#A1A1AA]">
          // TONE_PITCH_CALIBRATION
        </span>
        <span className="text-[10px] text-[#00AFFF] font-mono tabular-nums">
          X: {Math.round(toneX * 100)}% &bull; Y: {Math.round(pitchY * 100)}%
        </span>
      </div>

      <div
        ref={padRef}
        className={`relative w-full h-24 rounded-[2px] bg-[#111113] border overflow-hidden cursor-crosshair select-none touch-none transition-colors ${
          isDragging ? 'border-[#00AFFF] shadow-[0_0_15px_rgba(0,175,255,0.2)]' : 'border-[#27272A]'
        }`}
        onPointerDown={(e) => {
          setIsDragging(true);
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          updateFromPointer(e);
        }}
        onPointerMove={(e) => isDragging && updateFromPointer(e)}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
      >
        {/* Technical Crosshairs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.08]" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.08]" />
        </div>

        {/* Axis Labels */}
        <span className="absolute top-2 left-2.5 text-[9px] font-mono text-[#71717A]">
          SHARP +1.0
        </span>
        <span className="absolute bottom-2 left-2.5 text-[9px] font-mono text-[#71717A]">
          THOCK 0.0
        </span>
        <span className="absolute bottom-2 right-2.5 text-[9px] font-mono text-[#71717A]">
          CLACK +1.0
        </span>

        {/* Reticle Handle */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${toneX * 100}%`,
            top: `${(1 - pitchY) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-3.5 h-3.5 rounded-[2px] bg-[#00AFFF] border border-[#000000] shadow-[0_0_10px_rgba(0,175,255,0.8)]" />
        </div>
      </div>
    </div>
  );
}
