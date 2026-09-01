'use client';

import { AnimatePresence, motion } from 'motion/react';
import { LogoIcon } from './LogoIcon';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function Header({ enabled, onToggle }: HeaderProps) {
  return (
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-line bg-surface px-4">
      <div className="flex items-center gap-2.5">
        <motion.span
          animate={enabled ? { rotate: [0, -6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex"
        >
          <LogoIcon size={26} />
        </motion.span>

        <div>
          <p className="text-[14px] font-semibold leading-none tracking-[-0.02em] text-content">
            Mount
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={enabled ? 'on' : 'off'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-[11px] leading-none text-content-2"
            >
              {enabled ? 'Listening' : 'Muted'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle size={32} />

        {/* Power switch */}
        <button
          onClick={() => onToggle(!enabled)}
          aria-label={enabled ? 'Mute Mount' : 'Unmute Mount'}
          aria-pressed={enabled}
          className="relative h-[26px] w-[46px] flex-shrink-0 cursor-pointer rounded-full border"
          style={{
            backgroundColor: enabled ? 'var(--accent)' : 'var(--surface-3)',
            borderColor: enabled ? 'var(--accent)' : 'var(--border-strong)',
            transition:
              'background-color 0.25s var(--ease-out), border-color 0.25s var(--ease-out)',
          }}
        >
          <motion.span
            className="absolute top-[2px] block h-[20px] w-[20px] rounded-full bg-surface"
            style={{ boxShadow: 'var(--shadow-sm)' }}
            initial={false}
            animate={{ x: enabled ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 520, damping: 32 }}
          />
        </button>
      </div>
    </header>
  );
}
