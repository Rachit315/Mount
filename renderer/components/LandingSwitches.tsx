'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { switchProfiles, SwitchType } from '@/lib/switch-profiles';
import { audioEngine } from '@/lib/audio-engine';
import { useSoundSession } from '@/lib/sound-session';
import { SectionHeading } from './SectionHeading';

const TABS = ['all', 'linear', 'tactile', 'clicky'] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

export function LandingSwitches() {
  const { profileId, setProfileId } = useSoundSession();
  const [filter, setFilter] = useState<'all' | SwitchType>('all');
  const [auditioningId, setAuditioningId] = useState<string | null>(null);

  const filteredProfiles =
    filter === 'all'
      ? switchProfiles
      : switchProfiles.filter((p) => p.type === filter);

  const handleAudition = (id: string) => {
    setAuditioningId(id);
    setProfileId(id);
    window.setTimeout(() => {
      audioEngine.playKeystroke(30, 'release', id);
      window.setTimeout(() => setAuditioningId(null), 220);
    }, 120);
  };

  return (
    <section
      id="switches"
      className="relative z-10 mx-auto max-w-shell px-5 py-24 sm:px-6"
    >
      <SectionHeading
        eyebrow="The library"
        title="Thirteen boards, sampled from the real thing"
        description="Each pack carries row-accurate downstrokes plus its own release tail, so held keys and quick taps don't sound the same."
        trailing={
          <div className="segment w-full sm:w-auto">
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
                  className="segment-item capitalize"
                >
                  {isActive && (
                    <motion.span
                      layoutId="switches-tab"
                      className="absolute inset-0 rounded-[6px] bg-surface shadow-xs"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab} <span className="tabular-nums opacity-50">{count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        }
      />

      <motion.div
        layout
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProfiles.map((p, i) => {
            const isAuditioning = auditioningId === p.id;
            const isActive = profileId === p.id;

            return (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 22, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE, delay: (i % 6) * 0.04 }}
                whileHover={{ y: -4 }}
                className="card flex flex-col justify-between p-5"
                style={{
                  borderColor: isActive ? 'var(--accent-line)' : undefined,
                  boxShadow: isAuditioning
                    ? '0 0 0 3px var(--accent-soft), var(--shadow-lg)'
                    : undefined,
                }}
              >
                <div>
                  <div className="mb-3.5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Miniature switch stem */}
                      <span
                        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md"
                        style={{
                          background:
                            'linear-gradient(180deg, var(--cap-alpha-top), var(--cap-alpha-side))',
                          boxShadow: 'var(--shadow-xs)',
                        }}
                      >
                        <motion.span
                          className="h-3.5 w-3.5 rounded-[3px]"
                          style={{ backgroundColor: p.color }}
                          animate={
                            isAuditioning ? { scale: [1, 0.78, 1] } : { scale: 1 }
                          }
                          transition={{ duration: 0.3 }}
                        />
                      </span>

                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-semibold tracking-[-0.015em] text-content">
                          {p.name}
                        </h3>
                        <p className="text-[12px] text-content-3">{p.brand}</p>
                      </div>
                    </div>

                    <span className="badge capitalize">{p.type}</span>
                  </div>

                  <p className="mb-4 text-[13px] leading-relaxed text-content-2">
                    {p.description}
                  </p>

                  <dl className="card-inset mb-4 space-y-2 p-3 font-mono text-[11.5px]">
                    <Row label="Force" value={`${p.actuation} → ${p.bottomOut}`} />
                    <Row label="Character" value={p.tag} accent />
                    <Row
                      label="Samples"
                      value={`${p.files.press.length} press · ${p.files.release.length} release`}
                    />
                  </dl>
                </div>

                <motion.button
                  onClick={() => handleAudition(p.id)}
                  whileTap={{ scale: 0.97 }}
                  className={`btn btn-sm w-full ${
                    isAuditioning ? 'btn-accent' : 'btn-ghost'
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isAuditioning ? (
                      <motion.span
                        key="playing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <SoundBars />
                        Playing
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                        {isActive ? 'Selected — hear it again' : 'Hear it'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="uppercase tracking-[0.09em] text-content-3">{label}</dt>
      <dd
        className="truncate text-right font-medium"
        style={{ color: accent ? 'var(--accent)' : 'var(--text)' }}
      >
        {value}
      </dd>
    </div>
  );
}

function SoundBars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-current"
          animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.12,
            ease: 'easeInOut',
          }}
          style={{ height: '30%' }}
        />
      ))}
    </span>
  );
}
