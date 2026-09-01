'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export function VolumeControl({ volume, onChange }: VolumeControlProps) {
  const [dragging, setDragging] = useState(false);
  const pct = Math.round(volume * 100);

  return (
    <div className="px-4 py-3">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="label-md">Volume</span>
        <motion.span
          key={pct}
          initial={{ opacity: 0.4, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="font-mono text-[11.5px] font-semibold tabular-nums"
          style={{ color: 'var(--accent)' }}
        >
          {pct}%
        </motion.span>
      </div>

      <div className="group relative flex h-6 items-center">
        {/* Track */}
        <div
          className="absolute inset-x-0 h-[7px] overflow-hidden rounded-full"
          style={{
            backgroundColor: 'var(--surface-3)',
            boxShadow: 'var(--shadow-inset)',
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--accent)' }}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          aria-label="Volume"
        />

        {/* Thumb */}
        <motion.div
          className="pointer-events-none absolute rounded-full border-2 bg-surface"
          style={{
            width: 16,
            height: 16,
            borderColor: 'var(--accent)',
            boxShadow: 'var(--shadow-sm)',
          }}
          initial={false}
          animate={{
            left: `calc(${pct}% - 8px)`,
            scale: dragging ? 1.22 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
        />
      </div>
    </div>
  );
}
