'use client';

import Link from 'next/link';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import { LogoIcon } from './LogoIcon';
import { ThemeToggle } from './ThemeToggle';

interface LandingNavbarProps {
  onOpenDownload: () => void;
}

const NAV_LINKS = [
  { href: '#sandbox', label: 'Sound engine' },
  { href: '#switches', label: 'Switches' },
  { href: '#features', label: 'How it works' },
];

export function LandingNavbar({ onOpenDownload }: LandingNavbarProps) {
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => setLifted(v > 12));

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50"
    >
      <div
        className="border-b transition-[background-color,border-color,backdrop-filter] duration-500"
        style={{
          backgroundColor: lifted
            ? 'color-mix(in srgb, var(--bg) 78%, transparent)'
            : 'transparent',
          borderColor: lifted ? 'var(--border)' : 'transparent',
          backdropFilter: lifted ? 'blur(14px) saturate(150%)' : 'none',
        }}
      >
        {/* Equal-width outer columns so the links land on the true centre —
           the brand and the action cluster are very different widths, and
           justify-between would offset the nav by the difference. */}
        <div className="mx-auto grid h-[68px] max-w-shell grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-6">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 justify-self-start">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 380, damping: 15 }}
              className="flex"
            >
              <LogoIcon size={28} />
            </motion.span>
            <span className="text-[16px] font-semibold tracking-[-0.02em] text-content">
              Mount
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-1 justify-self-center">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative hidden rounded-md px-3.5 py-2 text-[14px] font-medium text-content-2 transition-colors duration-200 hover:text-content md:inline-flex"
              >
                <span className="relative z-10">{l.label}</span>
                <motion.span
                  className="absolute inset-0 rounded-md bg-surface-2 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 justify-self-end">
            <Link
              href="/app"
              className="btn btn-ghost btn-sm hidden sm:inline-flex"
            >
              Open web app
            </Link>

            <button onClick={onOpenDownload} className="btn btn-primary btn-sm">
              <svg
                width="14"
                height="14"
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
              Download
            </button>

            <a
              href="https://github.com/Rachit315/Mount"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line bg-surface text-content-2 shadow-xs transition-colors duration-200 hover:border-line-strong hover:text-content"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
