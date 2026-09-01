'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { LogoIcon } from './LogoIcon';
import { ThemeToggle } from './ThemeToggle';

const LINK_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'Sound engine', href: '#sandbox' },
      { label: 'Switch library', href: '#switches' },
      { label: 'How it works', href: '#features' },
    ],
  },
  {
    title: 'Get it',
    links: [
      {
        label: 'Download for Windows',
        href: 'https://github.com/Rachit315/Mount/releases/latest/download/Mount-Windows-x64.zip',
      },
      {
        label: 'All releases',
        href: 'https://github.com/Rachit315/Mount/releases',
      },
      { label: 'Web app', href: '/app', internal: true },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/Rachit315/Mount' },
      {
        label: 'Report an issue',
        href: 'https://github.com/Rachit315/Mount/issues',
      },
      {
        label: 'Contributing',
        href: 'https://github.com/Rachit315/Mount/blob/main/CONTRIBUTING.md',
      },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-surface">
      <div className="mx-auto max-w-shell px-5 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-3 flex items-center gap-2.5">
              <LogoIcon size={26} />
              <span className="text-[16px] font-semibold tracking-[-0.02em] text-content">
                Mount
              </span>
            </div>
            <p className="max-w-xs text-[13.5px] leading-relaxed text-content-2">
              Real mechanical keyboard sound for a keyboard that doesn&apos;t have
              any. Runs offline, costs nothing.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://github.com/Rachit315/Mount"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line bg-bg text-content-2 transition-colors hover:border-line-strong hover:text-content"
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

          {/* Links */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="label-md mb-3.5">{group.title}</p>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {'internal' in link && link.internal ? (
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-content-2 transition-colors hover:text-content"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith('#') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="text-[13.5px] text-content-2 transition-colors hover:text-content"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-7 sm:flex-row">
          <p className="text-[12.5px] text-content-3">
            © {new Date().getFullYear()} Mount. Open source and offline.
          </p>

          <motion.div
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-content-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            13 switch packs loaded
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
