'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useKeyboardEvents } from '@/lib/use-keyboard-events';
import { LogoIcon } from '@/components/LogoIcon';
import { ThemeToggle } from '@/components/ThemeToggle';

const EASE = [0.22, 1, 0.36, 1] as const;

function detectIsMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /mac|darwin/i.test(navigator.userAgent);
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [testCount, setTestCount] = useState(0);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (window.mount?.getPlatform) {
      window.mount.getPlatform().then((p) => setIsMac(p === 'darwin'));
    } else {
      setIsMac(detectIsMac());
    }
  }, []);

  const { keystrokeCount } = useKeyboardEvents({
    enabled: true,
    profileId: 'alpaca',
  });

  const shortcutKey = isMac ? '⌘ + Shift + K' : 'Ctrl + Shift + K';

  return (
    <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden bg-bg p-6 text-content">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 60% at 50% -5%, var(--accent-soft), transparent 65%)',
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />

      <div className="absolute right-5 top-5 z-10">
        <ThemeToggle size={34} />
      </div>

      <div className="relative z-10 w-full max-w-[380px]">
        {/* Progress */}
        <div className="mb-6 flex justify-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <motion.span
              key={s}
              className="h-[3px] rounded-full"
              initial={false}
              animate={{
                width: s === step ? 30 : 16,
                backgroundColor:
                  s <= step ? 'var(--accent)' : 'var(--border-strong)',
                opacity: s < step ? 0.5 : 1,
              }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <Card key="step-1">
              <div className="mx-auto mb-5 flex justify-center">
                <motion.span
                  initial={{ scale: 0.6, rotate: -14, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  className="flex"
                >
                  <LogoIcon size={48} />
                </motion.span>
              </div>

              <h1 className="mb-2.5 text-[22px] font-semibold tracking-[-0.025em] text-content">
                Welcome to Mount
              </h1>
              <p className="body-md mb-7 text-[14px]">
                Real mechanical switch sound over everything you type on your{' '}
                {isMac ? 'Mac' : 'PC'}. Thirteen sampled boards, stereo
                placement, and nothing leaves the machine.
              </p>

              <button
                onClick={() => setStep(2)}
                className="btn btn-primary w-full"
              >
                Get started
              </button>
            </Card>
          )}

          {step === 2 && (
            <Card key="step-2">
              <h2 className="mb-2 text-[19px] font-semibold tracking-[-0.02em] text-content">
                Give it a try
              </h2>
              <p className="body-md mb-5 text-[14px]">
                Type anything at all — you&apos;ll hear both the downstroke and
                the release.
              </p>

              <div
                tabIndex={0}
                onKeyDown={() => setTestCount((c) => c + 1)}
                className="card-inset mb-6 cursor-pointer px-4 py-5 text-center outline-none"
              >
                <p className="label-md mb-1.5">Keystrokes heard</p>
                <motion.p
                  key={keystrokeCount + testCount}
                  initial={{ scale: 1.18, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="font-mono text-[38px] font-semibold tabular-nums leading-none"
                  style={{ color: 'var(--accent)' }}
                >
                  {keystrokeCount + testCount}
                </motion.p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setStep(1)}
                  className="btn btn-ghost flex-1"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn btn-primary flex-1"
                >
                  Sounds good
                </button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card key="step-3">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 17 }}
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                <motion.svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.polyline
                    points="20 6 9 17 4 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
                  />
                </motion.svg>
              </motion.div>

              <h2 className="mb-2.5 text-[19px] font-semibold tracking-[-0.02em] text-content">
                You&apos;re all set
              </h2>
              <p className="body-md mb-6 text-[14px]">
                Mount lives in your {isMac ? 'menu bar' : 'system tray'}. Press{' '}
                <kbd
                  className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[11px]"
                  style={{
                    backgroundColor: 'var(--surface-inset)',
                    color: 'var(--accent)',
                  }}
                >
                  {shortcutKey}
                </kbd>{' '}
                to bring this panel back any time.
              </p>

              <Link href="/app" className="btn btn-primary w-full">
                Open Mount
              </Link>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="card p-7 text-center shadow-lg"
    >
      {children}
    </motion.div>
  );
}
