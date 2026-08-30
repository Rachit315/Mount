'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useKeyboardEvents } from '../../lib/use-keyboard-events';
import { getProfileById } from '../../lib/switch-profiles';
import { LogoIcon } from '../../components/LogoIcon';

function detectIsMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /mac|darwin/i.test(navigator.userAgent);
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [testCount, setTestCount] = useState(0);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Prefer Electron's platform API if available
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

  const profile = getProfileById('alpaca');
  const shortcutKey = isMac ? '⌘+Shift+K' : 'Ctrl+Shift+K';

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 text-[#FFFFFF] select-none font-mono relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00AFFF]/[0.08] via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-sm z-10">
        {/* Progress indicators */}
        <div className="flex justify-center gap-1.5 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 rounded-[2px] transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-[#00AFFF]'
                  : s < step
                    ? 'w-4 bg-[#00AFFF]/50'
                    : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#18181B] border border-[#27272A] rounded-[2px] p-6 shadow-2xl text-center"
            >
              <div className="flex justify-center mx-auto mb-4">
                <LogoIcon size={44} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#00AFFF]/10 border border-[#00AFFF]/20 text-[#00AFFF] text-[10px] font-mono mb-2 uppercase">
                <span>[ VORTEX // SETUP ]</span>
              </div>

              <h1 className="text-xl font-bold text-[#FFFFFF] mb-2 font-mono">Welcome to Mount</h1>
              <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed">
                Experience authentic mechanical keyboard sounds while typing anywhere on your {isMac ? 'Mac' : 'PC'}. 13 hardware switch packs, spatial audio, and 100% offline.
              </p>

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 px-4 bg-[#00AFFF] hover:bg-[#33BFFF] text-[#000000] text-xs font-bold rounded-[2px] transition-all shadow-[0_0_15px_rgba(0,175,255,0.4)] cursor-pointer uppercase"
              >
                Get Started &rarr;
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#18181B] border border-[#27272A] rounded-[2px] p-6 shadow-2xl text-center"
            >
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#00AFFF]/10 border border-[#00AFFF]/20 text-[#00AFFF] text-[10px] font-mono mb-2 uppercase">
                <span>[ CALIBRATION // 02 ]</span>
              </div>

              <h2 className="text-lg font-bold text-[#FFFFFF] mb-1 font-mono">Test Your Sound</h2>
              <p className="text-xs text-[#A1A1AA] mb-4">
                Type anything on your physical keyboard to audition downstroke &amp; release audio feedback.
              </p>

              <div
                tabIndex={0}
                onKeyDown={() => setTestCount((c) => c + 1)}
                className="my-4 p-4 rounded-[2px] bg-[#111113] border border-[#27272A] focus:border-[#00AFFF] outline-none cursor-pointer transition-colors"
              >
                <p className="text-[10px] text-[#71717A] mb-1 font-mono uppercase">// KEYSTROKES_DETECTED</p>
                <p className="text-3xl font-bold text-[#00AFFF] tabular-nums font-mono">
                  {keystrokeCount + testCount}
                </p>
                <p className="text-[10px] text-[#52525B] mt-1 font-mono">Focus here or type anywhere</p>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 px-4 bg-[#111113] hover:bg-[#27272A] border border-[#27272A] text-[#FFFFFF] text-xs font-semibold rounded-[2px] transition-colors cursor-pointer uppercase"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 px-4 bg-[#00AFFF] hover:bg-[#33BFFF] text-[#000000] text-xs font-bold rounded-[2px] transition-all shadow-[0_0_15px_rgba(0,175,255,0.4)] cursor-pointer uppercase"
                >
                  Sounds Good!
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#18181B] border border-[#27272A] rounded-[2px] p-6 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-[2px] bg-[#00AFFF]/10 text-[#00AFFF] flex items-center justify-center mx-auto mb-4 border border-[#00AFFF]/30 shadow-[0_0_15px_rgba(0,175,255,0.3)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="text-lg font-bold text-[#FFFFFF] mb-2 font-mono">System Ready</h2>
              <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">
                Mount is running in your {isMac ? 'menu bar' : 'system tray'}. Press <kbd className="px-1.5 py-0.5 rounded-[2px] bg-[#111113] border border-[#27272A] text-[#00AFFF] font-mono text-[10px]">{shortcutKey}</kbd> to toggle the popover at any time.
              </p>

              <Link
                href="/"
                className="block w-full py-2.5 px-4 bg-[#00AFFF] hover:bg-[#33BFFF] text-[#000000] text-xs font-bold rounded-[2px] transition-all shadow-[0_0_15px_rgba(0,175,255,0.4)] text-center uppercase"
              >
                Open Mount System
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

