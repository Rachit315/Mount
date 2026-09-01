'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Quiet, warm backdrop: a faint line grid that drifts on scroll plus two slow
 * accent blooms. Pure CSS/transform — no canvas loop, so it costs nothing.
 */
export function AmbientBackground() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], ['0px', '-120px']);
  const bloomY = useTransform(scrollYProgress, [0, 1], ['0px', '220px']);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base warmth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 62%)',
        }}
      />

      {/* Drifting grid */}
      <motion.div
        style={{ y: reduced ? 0 : gridY }}
        className="line-grid absolute -inset-y-40 inset-x-0 opacity-70"
      />

      {/* Slow blooms */}
      <motion.div
        style={{ y: reduced ? 0 : bloomY }}
        className="absolute inset-0"
      >
        <div
          className="breathe absolute -left-24 top-[22%] h-[380px] w-[380px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in srgb, var(--accent) 14%, transparent), transparent)',
          }}
        />
        <div
          className="breathe absolute -right-20 top-[58%] h-[440px] w-[440px] rounded-full blur-3xl"
          style={{
            animationDelay: '2.5s',
            background:
              'radial-gradient(closest-side, color-mix(in srgb, var(--cap-mod) 30%, transparent), transparent)',
          }}
        />
      </motion.div>

      {/* Grain + bottom fade */}
      <div className="grain absolute inset-0 opacity-60" />
      <div
        className="absolute inset-x-0 bottom-0 h-56"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }}
      />
    </div>
  );
}
