'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '@/lib/theme';

interface ThemeToggleProps {
  size?: number;
  className?: string;
}

/**
 * Sun / moon theme switch. The icon that shows is the theme you'll get,
 * and it swaps with a small rotate-and-scale so the change feels physical.
 */
export function ThemeToggle({ size = 38, className = '' }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const iconSize = Math.round(size * 0.46);

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      className={`relative flex items-center justify-center rounded-full border border-line bg-surface text-content-2 shadow-xs hover:text-content hover:border-line-strong cursor-pointer overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.svg
            key="sun"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ rotate: -80, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 80, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="currentColor"
            initial={{ rotate: 80, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -80, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d="M20.3 14.4A8.6 8.6 0 0 1 9.6 3.7a1 1 0 0 0-1.3-1.2 10.3 10.3 0 1 0 13.2 13.2 1 1 0 0 0-1.2-1.3Z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
