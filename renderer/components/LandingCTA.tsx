'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Reveal } from './Reveal';

interface LandingCTAProps {
  onOpenDownload: () => void;
}

/** Closing panel — a row of caps drifts as you scroll past it. */
export function LandingCTA({ onOpenDownload }: LandingCTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const capsX = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const capsY = useTransform(scrollYProgress, [0, 1], ['22px', '-22px']);

  return (
    <section
      ref={ref}
      className="relative z-10 mx-auto max-w-shell px-5 pb-24 pt-8 sm:px-6"
    >
      <Reveal y={32}>
        <div
          className="relative overflow-hidden rounded-xl border border-line px-6 py-16 text-center sm:px-12"
          style={{
            background:
              'linear-gradient(150deg, var(--surface-2) 0%, var(--surface) 55%, var(--surface-3) 100%)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Drifting caps */}
          <motion.div
            aria-hidden
            style={{ x: capsX, y: capsY }}
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-6 opacity-[0.07]"
          >
            {['M', 'O', 'U', 'N', 'T'].map((c, i) => (
              <span
                key={c}
                className="keycap items-center justify-center"
                style={{
                  width: 96,
                  height: 96,
                  fontSize: 40,
                  fontWeight: 700,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotate(${(i - 2) * 5}deg) translateY(${
                    Math.abs(i - 2) * 12
                  }px)`,
                }}
              >
                {c}
              </span>
            ))}
          </motion.div>

          <div className="relative z-10">
            <h2 className="display-md mx-auto mb-4 max-w-2xl text-content">
              Give your keyboard the sound it deserves
            </h2>
            <p className="body-md mx-auto mb-8 max-w-md">
              Free, open source, and offline. Install it once and forget it&apos;s
              running — until you start typing.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.button
                onClick={onOpenDownload}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-accent"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Mount
              </motion.button>

              <Link href="/app" className="btn btn-ghost">
                Open the web app
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
