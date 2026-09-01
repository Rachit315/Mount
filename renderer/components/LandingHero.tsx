'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Keyboard3D } from './Keyboard3D';
import { useSoundSession } from '@/lib/sound-session';

interface LandingHeroProps {
  onOpenDownload: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: '<10ms', label: 'Input latency' },
  { value: '13', label: 'Switch packs' },
  { value: 'Stereo', label: 'Spatial panning' },
  { value: '100%', label: 'Offline' },
];

const HEADLINE = ['Your keyboard,', 'but it sounds'];

export function LandingHero({ onOpenDownload }: LandingHeroProps) {
  // Live keystrokes drive the hero board — type anywhere and it responds.
  const { pressedKeys, profileId } = useSoundSession();

  return (
    <section className="relative z-10 px-5 pb-10 pt-14 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-shell text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-7 flex justify-center"
        >
          <span className="badge">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
            />
            Free &amp; open source · Windows + macOS
          </span>
        </motion.div>

        {/* Headline — words rise in sequence */}
        <h1 className="display-xl mx-auto mb-6 max-w-4xl text-content">
          {HEADLINE.map((line, li) => (
            <span key={li} className="block overflow-hidden pb-1">
              {line.split(' ').map((word, wi) => (
                <motion.span
                  key={`${li}-${wi}`}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.85,
                    ease: EASE,
                    delay: 0.08 + li * 0.16 + wi * 0.07,
                  }}
                  className="inline-block"
                >
                  {word}
                  {wi < line.split(' ').length - 1 && ' '}
                </motion.span>
              ))}
            </span>
          ))}
          <span className="block overflow-hidden pb-1">
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.42 }}
              className="inline-block italic"
              style={{ color: 'var(--accent)' }}
            >
              expensive.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          className="body-lg mx-auto mb-9 max-w-xl"
        >
          Mount layers real, sampled mechanical switch audio over every keystroke
          you make — anywhere on your machine. Thirteen boards, true stereo
          placement, and nothing ever leaves your computer.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.58 }}
          className="mb-4 flex flex-wrap items-center justify-center gap-3"
        >
          <button onClick={onOpenDownload} className="btn btn-primary">
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
            Download for free
          </button>

          <Link href="/app" className="btn btn-ghost">
            Try it in the browser
            <span aria-hidden style={{ color: 'var(--accent)' }}>
              →
            </span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mb-14 font-mono text-[11.5px] uppercase tracking-[0.14em] text-content-3"
        >
          Start typing — the board below is listening
        </motion.p>
      </div>

      {/* 3D board */}
      <div className="mx-auto max-w-[920px] px-2 sm:px-4">
        <Keyboard3D pressedKeys={pressedKeys} profileId={profileId} />
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
        className="mx-auto mt-16 max-w-shell"
      >
        <div className="card grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
          {STATS.map((s) => (
            <div key={s.label} className="px-5 py-6 text-center">
              <p className="font-mono text-[26px] font-semibold tracking-[-0.03em] text-content">
                {s.value}
              </p>
              <p className="mt-1 text-[13px] text-content-2">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
