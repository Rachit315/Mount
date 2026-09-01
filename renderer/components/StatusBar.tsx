'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface StatusBarProps {
  profileName: string;
  keystrokeCount: number;
  enabled: boolean;
}

export function StatusBar({
  profileName,
  keystrokeCount,
  enabled,
}: StatusBarProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/mac|darwin/i.test(navigator.userAgent));
    }
  }, []);

  return (
    <footer className="mt-auto flex flex-shrink-0 items-center justify-between border-t border-line bg-surface px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <motion.span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{
            backgroundColor: enabled ? 'var(--accent)' : 'var(--text-3)',
          }}
          animate={enabled ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={{ duration: 2.2, repeat: enabled ? Infinity : 0 }}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={enabled ? profileName : 'muted'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="truncate text-[12px] font-medium text-content"
          >
            {enabled ? profileName : 'Muted'}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2.5">
        <span className="font-mono text-[11px] tabular-nums text-content-3">
          {keystrokeCount.toLocaleString()} keys
        </span>
        <kbd
          className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] text-content-2"
          style={{ backgroundColor: 'var(--surface-inset)' }}
        >
          {isMac ? '⌘⇧K' : 'Ctrl+⇧+K'}
        </kbd>
      </div>
    </footer>
  );
}
