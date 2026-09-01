'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LogoIcon } from './LogoIcon';

const DOWNLOAD_WINDOWS_URL =
  'https://github.com/Rachit315/Mount/releases/latest/download/Mount-Windows-x64.zip';
const GITHUB_RELEASES_PAGE = 'https://github.com/Rachit315/Mount/releases';
const CLONE_COMMAND =
  'git clone https://github.com/Rachit315/Mount.git && cd Mount && npm install && npm run dev';

const STEPS = [
  {
    n: '01',
    text: 'Download Mount-Windows-x64.zip',
    code: 'Mount-Windows-x64.zip',
  },
  { n: '02', text: 'Extract it anywhere on your PC' },
  { n: '03', text: 'Run Mount.exe — it drops straight into your tray' },
];

interface LandingDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LandingDownloadModal({
  isOpen,
  onClose,
}: LandingDownloadModalProps) {
  const [copied, setCopied] = useState(false);

  // Escape to dismiss, and don't let the page scroll behind the sheet.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(CLONE_COMMAND);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--bg) 72%, transparent)',
              backdropFilter: 'blur(10px)',
            }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Download Mount"
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="card relative w-full max-w-lg overflow-hidden p-6 shadow-lg sm:p-7"
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <LogoIcon size={34} />
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-content">
                    Download Mount
                  </h2>
                  <p className="text-[12.5px] text-content-2">
                    v2.0.0 · Windows x64 portable
                  </p>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                aria-label="Close"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface-inset text-content-2 hover:text-content"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <p className="mb-5 text-[13.5px] leading-relaxed text-content-2">
              A self-contained bundle with the native keyboard driver already
              compiled in. No installer, no setup, no account.
            </p>

            {/* Steps */}
            <ol className="card-inset mb-5 space-y-3 p-4">
              {STEPS.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                  className="flex items-start gap-3 text-[13px]"
                >
                  <span
                    className="font-mono text-[11px] font-bold"
                    style={{ color: 'var(--accent)' }}
                  >
                    {s.n}
                  </span>
                  <span className="text-content-2">
                    {s.code ? (
                      <>
                        Download{' '}
                        <code className="rounded-sm border border-line bg-surface px-1.5 py-0.5 font-mono text-[11.5px] text-content">
                          {s.code}
                        </code>
                      </>
                    ) : (
                      s.text
                    )}
                  </span>
                </motion.li>
              ))}
            </ol>

            {/* Source */}
            <div className="card-inset mb-6 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="label-md">Or run from source</span>
                <button
                  onClick={handleCopy}
                  className="font-mono text-[11px] font-semibold transition-opacity hover:opacity-70"
                  style={{ color: 'var(--accent)' }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-sm border border-line bg-surface p-2.5 font-mono text-[11px] leading-relaxed text-content">
                {CLONE_COMMAND}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={DOWNLOAD_WINDOWS_URL}
                download="Mount-Windows-x64.zip"
                className="btn btn-primary flex-1"
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
                Download for Windows
              </a>

              <a
                href={GITHUB_RELEASES_PAGE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                All releases
                <span aria-hidden style={{ color: 'var(--accent)' }}>
                  ↗
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
