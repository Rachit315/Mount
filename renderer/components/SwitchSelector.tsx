'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { switchProfiles, SwitchType } from '@/lib/switch-profiles';
import { audioEngine } from '@/lib/audio-engine';

interface SwitchSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const TABS = ['all', 'linear', 'tactile', 'clicky'] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

export function SwitchSelector({ selectedId, onSelect }: SwitchSelectorProps) {
  const [filter, setFilter] = useState<'all' | SwitchType>('all');

  const filteredProfiles =
    filter === 'all'
      ? switchProfiles
      : switchProfiles.filter((p) => p.type === filter);

  return (
    <div className="px-4 py-3">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="label-md">Switch</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-content-3">
          {switchProfiles.length} packs
        </span>
      </div>

      <div className="segment mb-3">
        {TABS.map((tab) => {
          const isActive = filter === tab;
          const count =
            tab === 'all'
              ? switchProfiles.length
              : switchProfiles.filter((p) => p.type === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              data-active={isActive}
              className="segment-item !px-1.5 !py-1 !text-[11px] capitalize"
            >
              {isActive && (
                <motion.span
                  layoutId="app-switch-tab"
                  className="absolute inset-0 rounded-[6px] bg-surface shadow-xs"
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                />
              )}
              <span className="relative z-10">
                {tab} <span className="tabular-nums opacity-50">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        layout
        className="scrollbar-thin grid max-h-[224px] grid-cols-2 gap-2 overflow-y-auto pr-1"
      >
        <AnimatePresence mode="popLayout">
          {filteredProfiles.map((profile, i) => {
            const isSelected = profile.id === selectedId;

            return (
              <motion.button
                key={profile.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: EASE, delay: (i % 8) * 0.02 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onSelect(profile.id);
                  audioEngine.playKeystroke(30, 'press', profile.id);
                }}
                className="relative overflow-hidden rounded-md border p-2.5 text-left"
                style={{
                  borderColor: isSelected
                    ? 'var(--accent-line)'
                    : 'var(--border)',
                  backgroundColor: isSelected
                    ? 'var(--accent-soft)'
                    : 'var(--surface-inset)',
                  transition:
                    'border-color 0.22s var(--ease-out), background-color 0.22s var(--ease-out)',
                }}
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: profile.color }}
                  />
                  <span className="truncate text-[11.5px] font-semibold leading-none text-content">
                    {profile.name}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1 font-mono text-[9.5px] uppercase tracking-[0.08em]">
                  <span className="text-content-3">{profile.type}</span>
                  <span
                    className="truncate"
                    style={{
                      color: isSelected ? 'var(--accent)' : 'var(--text-3)',
                    }}
                  >
                    {profile.tag}
                  </span>
                </div>

                {isSelected && (
                  <motion.span
                    layoutId="app-switch-marker"
                    className="absolute inset-y-0 left-0 w-[2.5px]"
                    style={{ backgroundColor: 'var(--accent)' }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
