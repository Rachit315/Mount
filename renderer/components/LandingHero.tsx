'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  VintageKeyboard,
  KEY_ID_TO_CODE,
} from '@/components/ui/vintage-keyboard';
import { useSoundSession } from '@/lib/sound-session';
import { audioEngine } from '@/lib/audio-engine';
import { webKeyToScanCode } from '@/lib/spatial-audio';
import {
  DOWNLOADS,
  detectPlatform,
  familyOf,
  type PlatformId,
} from '@/lib/downloads';

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

const HEADLINE = [
  ['Your', 'keyboard,'],
  ['but', 'it', 'sounds'],
];

/** Vintage-board key id → the uiohook scan code our audio engine speaks. */
function scanCodeForKeyId(keyId: string): number {
  const code = KEY_ID_TO_CODE[keyId];
  if (!code) return 30;
  return webKeyToScanCode[code] ?? 30;
}

export function LandingHero({ onOpenDownload }: LandingHeroProps) {
  const { profileId } = useSoundSession();
  const [platform, setPlatform] = useState<PlatformId | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  // The board renders silent: physical keystrokes already reach the audio
  // engine through the shared sound session, so only clicked caps need a sound
  // played here. Doing both would voice every keystroke twice.
  const handleKeyPress = useCallback(
    (keyId: string, source: 'pointer' | 'keyboard') => {
      if (source !== 'pointer') return;
      audioEngine.playKeystroke(scanCodeForKeyId(keyId), 'press', profileId);
    },
    [profileId],
  );

  const handleKeyRelease = useCallback(
    (keyId: string, source: 'pointer' | 'keyboard') => {
      if (source !== 'pointer') return;
      audioEngine.playKeystroke(scanCodeForKeyId(keyId), 'release', profileId);
    },
    [profileId],
  );

  // Before detection resolves, show the neutral label rather than guessing.
  const primary = platform ? DOWNLOADS[platform] : null;
  const primaryLabel = primary ? primary.label : 'Download for free';
  const otherFamily = familyOf(platform) === 'windows' ? 'macOS' : 'Windows';

  return (
    <section className="relative z-10 px-5 pb-10 pt-14 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-shell text-center">
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

        <h1 className="display-xl mx-auto mb-6 max-w-4xl text-content">
          {HEADLINE.map((words, li) => (
            <span key={li} className="block overflow-hidden pb-1">
              {words.map((word, wi) => (
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
                  {/* A plain space would be trimmed at the end of an
                      inline-block, running the words together. */}
                  {wi < words.length - 1 && ' '}
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
          className="mb-3 flex flex-wrap items-center justify-center gap-3"
        >
          {primary ? (
            <a
              href={primary.url}
              download={primary.fileName}
              className="btn btn-primary"
            >
              <DownloadIcon />
              {primaryLabel}
            </a>
          ) : (
            <button onClick={onOpenDownload} className="btn btn-primary">
              <DownloadIcon />
              {primaryLabel}
            </button>
          )}

          <button onClick={onOpenDownload} className="btn btn-ghost">
            {platform ? `All downloads · ${otherFamily}` : 'All downloads'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12.5px] text-content-3"
        >
          {primary && <span>{primary.subtitle}</span>}
          <Link
            href="/app"
            className="underline decoration-dotted underline-offset-4 transition-colors hover:text-content"
          >
            or try it in the browser
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mb-12 font-mono text-[11.5px] uppercase tracking-[0.14em] text-content-3"
        >
          Start typing — the board below is listening
        </motion.p>
      </div>

      {/* Vintage board. Silent by design; the sound session owns the audio. */}
      <div className="mx-auto max-w-[860px] px-1 sm:px-4">
        <VintageKeyboard
          silent
          standalone={false}
          showIndicator={false}
          onKeyPress={handleKeyPress}
          onKeyRelease={handleKeyRelease}
        />
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

function DownloadIcon() {
  return (
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
  );
}
