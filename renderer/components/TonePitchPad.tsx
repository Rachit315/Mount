'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

interface TonePitchPadProps {
  toneX: number; // 0 (thock) → 1 (clack)
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
      const y = Math.max(
        0,
        Math.min(1, 1 - (e.clientY - rect.top) / rect.height),
      );
      onChange(x, y);
    },
    [onChange],
  );

  return (
    <div className="px-4 py-3">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="label-md">Tone &amp; pitch</span>
        <span className="font-mono text-[11px] tabular-nums text-content-2">
          {Math.round(toneX * 100)} · {Math.round(pitchY * 100)}
        </span>
      </div>

      <div
        ref={padRef}
        className="relative h-28 w-full cursor-crosshair touch-none select-none overflow-hidden rounded-md border"
        style={{
          backgroundColor: 'var(--surface-3)',
          borderColor: isDragging ? 'var(--accent-line)' : 'var(--border)',
          boxShadow: isDragging
            ? '0 0 0 3px var(--accent-soft), var(--shadow-inset)'
            : 'var(--shadow-inset)',
          transition: 'border-color 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out)',
        }}
        onPointerDown={(e) => {
          setIsDragging(true);
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          updateFromPointer(e);
        }}
        onPointerMove={(e) => isDragging && updateFromPointer(e)}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
      >
        {/* Grid */}
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute bottom-0 left-1/2 top-0 w-px"
            style={{ backgroundColor: 'var(--border-soft)' }}
          />
          <div
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ backgroundColor: 'var(--border-soft)' }}
          />
        </div>

        {/* Crosshair guides that follow the reticle */}
        <motion.div
          className="pointer-events-none absolute bottom-0 top-0 w-px"
          style={{ backgroundColor: 'var(--accent-line)' }}
          initial={false}
          animate={{ left: `${toneX * 100}%`, opacity: isDragging ? 1 : 0.4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
        <motion.div
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{ backgroundColor: 'var(--accent-line)' }}
          initial={false}
          animate={{
            top: `${(1 - pitchY) * 100}%`,
            opacity: isDragging ? 1 : 0.4,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />

        {/* Axis labels */}
        <span className="pointer-events-none absolute left-2.5 top-2 font-mono text-[9.5px] uppercase tracking-wider text-content-3">
          Sharp
        </span>
        <span className="pointer-events-none absolute bottom-2 left-2.5 font-mono text-[9.5px] uppercase tracking-wider text-content-3">
          Thock
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2.5 font-mono text-[9.5px] uppercase tracking-wider text-content-3">
          Clack
        </span>

        {/* Reticle */}
        <motion.div
          className="pointer-events-none absolute"
          initial={false}
          animate={{ left: `${toneX * 100}%`, top: `${(1 - pitchY) * 100}%` }}
          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
          style={{ translateX: '-50%', translateY: '-50%' }}
        >
          <motion.div
            className="rounded-full border-2 bg-surface"
            style={{ width: 16, height: 16, borderColor: 'var(--accent)' }}
            animate={{ scale: isDragging ? 1.25 : 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          >
            <div
              className="absolute inset-[3px] rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
