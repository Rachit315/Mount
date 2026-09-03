'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LogoIcon } from './LogoIcon';
import {
  APP_VERSION,
  DOWNLOADS,
  INSTALL_STEPS,
  MAC_GATEKEEPER_NOTE,
  MAC_QUARANTINE_COMMAND,
  MAC_TARGETS,
  RELEASES_PAGE,
  detectPlatform,
  familyOf,
  type PlatformFamily,
} from '@/lib/downloads';

interface LandingDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function LandingDownloadModal({
  isOpen,
  onClose,
}: LandingDownloadModalProps) {
  const [tab, setTab] = useState<Exclude<PlatformFamily, 'unknown'>>('windows');
  const [copied, setCopied] = useState(false);

  // Open on whichever platform the visitor is actually using.
  useEffect(() => {
    if (!isOpen) return;
    const family = familyOf(detectPlatform());
    if (family !== 'unknown') setTab(family);
  }, [isOpen]);

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
    navigator.clipboard.writeText(MAC_QUARANTINE_COMMAND);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const steps = INSTALL_STEPS[tab];

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
            className="card relative max-h-[88vh] w-full max-w-lg overflow-y-auto p-6 shadow-lg sm:p-7"
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
                    v{APP_VERSION} · free and open source
                  </p>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                aria-label="Close"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line bg-surface-inset text-content-2 hover:text-content"
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

            {/* Platform tabs */}
            <div className="segment mb-5">
              {(['windows', 'mac'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  data-active={tab === t}
                  className="segment-item"
                >
                  {tab === t && (
                    <motion.span
                      layoutId="download-tab"
                      className="absolute inset-0 rounded-[6px] bg-surface shadow-xs"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    {t === 'windows' ? <WindowsIcon /> : <AppleIcon />}
                    {t === 'windows' ? 'Windows' : 'macOS'}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                {/* Download buttons */}
                {tab === 'windows' ? (
                  <a
                    href={DOWNLOADS.windows.url}
                    download={DOWNLOADS.windows.fileName}
                    className="btn btn-primary mb-2 w-full"
                  >
                    <DownloadIcon />
                    Download for Windows
                  </a>
                ) : (
                  <div className="mb-2 grid gap-2 sm:grid-cols-2">
                    {MAC_TARGETS.map((target, i) => (
                      <a
                        key={target.id}
                        href={target.url}
                        download={target.fileName}
                        className={`btn w-full flex-col !h-auto py-2.5 ${
                          i === 0 ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-[13.5px]">
                          <DownloadIcon />
                          macOS
                        </span>
                        <span className="text-[11px] font-normal opacity-75">
                          {target.subtitle}
                        </span>
                      </a>
                    ))}
                  </div>
                )}

                <p className="mb-5 text-[11.5px] text-content-3">
                  {tab === 'windows'
                    ? DOWNLOADS.windows.subtitle
                    : 'Not sure which? Apple menu → About This Mac. “Apple M1/M2/M3…” means Apple Silicon.'}
                </p>

                {/* Install steps */}
                <ol className="card-inset mb-5 space-y-3 p-4">
                  {steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[13px] leading-relaxed"
                    >
                      <span
                        className="font-mono text-[11px] font-bold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-content-2">{step}</span>
                    </li>
                  ))}
                </ol>

                {/* macOS-only Gatekeeper help */}
                {tab === 'mac' && (
                  <div
                    className="mb-5 rounded-md border p-3.5"
                    style={{
                      borderColor: 'var(--accent-line)',
                      backgroundColor: 'var(--accent-soft)',
                    }}
                  >
                    <p
                      className="mb-2 text-[12.5px] font-medium leading-relaxed"
                      style={{ color: 'var(--accent)' }}
                    >
                      {MAC_GATEKEEPER_NOTE}
                    </p>
                    <p className="mb-2 text-[11.5px] text-content-2">
                      If macOS still says the app is damaged, clear the download
                      quarantine flag in Terminal:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 overflow-x-auto rounded-sm border border-line bg-surface px-2 py-1.5 font-mono text-[10.5px] text-content">
                        {MAC_QUARANTINE_COMMAND}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="flex-shrink-0 font-mono text-[11px] font-semibold transition-opacity hover:opacity-70"
                        style={{ color: 'var(--accent)' }}
                      >
                        {copied ? '✓' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <a
              href={RELEASES_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full"
            >
              All releases &amp; changelog
              <span aria-hidden style={{ color: 'var(--accent)' }}>
                ↗
              </span>
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
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

function AppleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.7 12.7c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9s-1.9-.9-3.1-.8c-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.9.8 3.1.7c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.6ZM14.3 5.5c.7-.8 1.1-2 1-3.2-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.5 2.9-1.3Z" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5.6 10.2 4.6v7.1H3V5.6Zm0 12.8 7.2 1v-7H3v6ZM11.1 19.5 21 21V12.6h-9.9v6.9Zm0-15V11.7H21V3l-9.9 1.5Z" />
    </svg>
  );
}
