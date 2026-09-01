'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { KEYBOARD_65, ROW_UNITS, type Cap } from '@/lib/keyboard-layout';
import { audioEngine } from '@/lib/audio-engine';

/** Gap between caps and case padding, both expressed as a fraction of 1u. */
const GAP_RATIO = 0.075;
const PAD_RATIO = 0.34;

interface Keyboard3DProps {
  /** Scan codes currently held down on the user's real keyboard. */
  pressedKeys?: Set<number>;
  /** Switch profile whose samples play when a cap is clicked. */
  profileId?: string;
  className?: string;
  /** Max rendered width in px. */
  maxWidth?: number;
}

/**
 * A tilted, physically-lit 65% board. It leans toward the cursor, its caps
 * depress on real keystrokes, and clicking a cap auditions that key's sample
 * through the same engine the desktop app uses.
 */
export function Keyboard3D({
  pressedKeys,
  profileId = 'alpaca',
  className = '',
  maxWidth = 860,
}: Keyboard3DProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const [unit, setUnit] = useState(40);
  const [clicked, setClicked] = useState<string | null>(null);

  // ── Cursor-driven tilt ───────────────────────────────────────────
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 130, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [19, 5]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-11, 11]), spring);
  const translateX = useSpring(useTransform(px, [-0.5, 0.5], [10, -10]), spring);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = frameRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    },
    [px, py],
  );

  const handlePointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  // ── Size the board to its container ──────────────────────────────
  // Every row is ROW_UNITS wide, so a row spans 16u + 15 gaps; the case adds
  // 2 × side padding. Solving that for u against the measured case width:
  //   width = u·16 + 15·(0.075u) + 2·(0.34u) = 17.805u
  useEffect(() => {
    const el = plateRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.min(el.getBoundingClientRect().width, maxWidth);
      setUnit(Math.max(16, w / (ROW_UNITS + 15 * GAP_RATIO + 2 * PAD_RATIO)));
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [maxWidth]);

  const handleCapDown = useCallback(
    (id: string, code: number) => {
      setClicked(id);
      audioEngine.playKeystroke(code, 'press', profileId);
    },
    [profileId],
  );

  const handleCapUp = useCallback(
    (code: number) => {
      setClicked(null);
      audioEngine.playKeystroke(code, 'release', profileId);
    },
    [profileId],
  );

  const gap = unit * GAP_RATIO;
  const pad = unit * PAD_RATIO;

  return (
    <div
      ref={frameRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full select-none ${className}`}
      style={{ perspective: 1500, perspectiveOrigin: '50% 45%' }}
    >
      {/* Warm ambient pool behind the board */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl breathe"
        style={{
          background:
            'radial-gradient(closest-side, var(--accent-soft), transparent 72%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 46, rotateX: 34 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            x: translateX,
            transformStyle: 'preserve-3d',
          }}
          className="mx-auto"
        >
          {/* Idle float */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Case */}
            <div
              ref={plateRef}
              className="keycap-case relative mx-auto"
              style={{
                maxWidth,
                padding: pad,
                paddingTop: pad * 1.15,
                paddingBottom: pad * 1.6,
              }}
            >
              {/* Bezel highlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-md"
                style={{
                  background:
                    'linear-gradient(158deg, rgba(255,255,255,0.28) 0%, transparent 42%)',
                }}
              />

              <div
                className="relative flex flex-col"
                style={{ gap, transformStyle: 'preserve-3d' }}
              >
                {KEYBOARD_65.map((row, r) => (
                  <div key={r} className="flex" style={{ gap }}>
                    {row.map((cap, c) => {
                      const id = `${r}-${c}`;
                      return (
                        <KeyCap3D
                          key={id}
                          cap={cap}
                          unit={unit}
                          gap={gap}
                          pressed={
                            clicked === id || !!pressedKeys?.has(cap.code)
                          }
                          onDown={() => handleCapDown(id, cap.code)}
                          onUp={() => handleCapUp(cap.code)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Badge on the case, like a real board's decal */}
              <div
                className="absolute font-mono uppercase tracking-[0.18em]"
                style={{
                  right: unit * 0.42,
                  bottom: unit * 0.13,
                  fontSize: Math.max(6, unit * 0.16),
                  color: 'rgba(28,27,24,0.42)',
                }}
              >
                Mount 65
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Contact shadow on the desk */}
      <div
        aria-hidden
        className="mx-auto -mt-4 rounded-[50%] blur-2xl"
        style={{
          width: '72%',
          height: unit * 0.9,
          background: 'var(--case-shadow)',
          opacity: 0.55,
        }}
      />
    </div>
  );
}

// ── Single cap ─────────────────────────────────────────────────────

const KeyCap3D = memo(function KeyCap3D({
  cap,
  unit,
  gap,
  pressed,
  onDown,
  onUp,
}: {
  cap: Cap;
  unit: number;
  gap: number;
  pressed: boolean;
  onDown: () => void;
  onUp: () => void;
}) {
  const w = cap.w ?? 1;
  const width = unit * w + gap * (w - 1);
  const legendSize = Math.max(7, unit * (cap.label.length > 2 ? 0.2 : 0.26));

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={() => pressed && onUp()}
      className="keycap cursor-pointer"
      data-mod={cap.kind === 'mod' || undefined}
      data-accent={cap.kind === 'accent' || undefined}
      data-pressed={pressed || undefined}
      style={{
        width,
        height: unit,
        flexShrink: 0,
        padding: `${unit * 0.13}px ${unit * 0.16}px`,
        fontSize: legendSize,
        lineHeight: 1.05,
      }}
    >
      {cap.shift && (
        <span style={{ opacity: 0.72, fontSize: legendSize * 0.92 }}>
          {cap.shift}
        </span>
      )}
      <span style={{ fontWeight: 600 }}>{cap.label}</span>
    </button>
  );
});
