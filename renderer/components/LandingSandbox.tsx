'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { switchProfiles, SwitchType } from '@/lib/switch-profiles';
import { audioEngine } from '@/lib/audio-engine';
import { useSoundSession } from '@/lib/sound-session';
import { TonePitchPad } from '@/components/TonePitchPad';
import { Visualizer } from '@/components/Visualizer';
import { VolumeControl } from '@/components/VolumeControl';
import { AudioVisualizerWave } from '@/components/AudioVisualizerWave';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

const TABS = ['all', 'linear', 'tactile', 'clicky'] as const;

export function LandingSandbox() {
  const {
    profileId,
    setProfileId,
    volume,
    setVolume,
    toneX,
    pitchY,
    setTonePitch,
    pressedKeys,
    keystrokeCount,
  } = useSoundSession();

  const [filter, setFilter] = useState<'all' | SwitchType>('all');

  const activeProfile =
    switchProfiles.find((p) => p.id === profileId) || switchProfiles[0];

  const filteredProfiles =
    filter === 'all'
      ? switchProfiles
      : switchProfiles.filter((p) => p.type === filter);

  return (
    <section
      id="sandbox"
      className="relative z-10 mx-auto max-w-shell px-5 py-24 sm:px-6"
    >
      <SectionHeading
        eyebrow="Live demo"
        title="Audition every board, right here"
        description="Pick a switch, then type on your real keyboard. Everything below runs the exact engine that ships in the desktop app."
        trailing={
          <span className="badge badge-accent">
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: 'currentColor' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Engine online
          </span>
        }
      />

      <Reveal y={30}>
        <div className="card grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-12">
          {/* ── Left: picker + controls ─────────────────────────────── */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="label-md">Switch profile</span>
                <span
                  className="font-mono text-[11px] font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  {activeProfile.name}
                </span>
              </div>

              <SegmentedTabs value={filter} onChange={setFilter} />

              <div className="scrollbar-thin mt-3 grid max-h-[268px] grid-cols-2 gap-2 overflow-y-auto pr-1">
                {filteredProfiles.map((p) => {
                  const isSelected = p.id === profileId;
                  return (
                    <motion.button
                      key={p.id}
                      layout
                      onClick={() => setProfileId(p.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                      className="relative rounded-md border p-3 text-left"
                      style={{
                        borderColor: isSelected
                          ? 'var(--accent-line)'
                          : 'var(--border)',
                        backgroundColor: isSelected
                          ? 'var(--accent-soft)'
                          : 'var(--surface-inset)',
                      }}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="truncate text-[12.5px] font-semibold text-content">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-content-3">
                        <span>{p.type}</span>
                        <span
                          className="truncate pl-1"
                          style={{ color: 'var(--accent)' }}
                        >
                          {p.tag}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="card-inset p-1">
              <VolumeControl volume={volume} onChange={setVolume} />
            </div>

            <div className="card-inset p-1">
              <TonePitchPad
                toneX={toneX}
                pitchY={pitchY}
                onChange={setTonePitch}
              />
            </div>
          </div>

          {/* ── Right: matrix + analyser + input ────────────────────── */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <span className="label-md">Spatial key matrix</span>
                <span className="font-mono text-[11px] tabular-nums text-content-2">
                  {keystrokeCount.toLocaleString()} keys
                </span>
              </div>
              <div className="card-inset p-1">
                <Visualizer
                  pressedKeys={pressedKeys}
                  accentColor={activeProfile.color}
                  showHeader={false}
                  unit={26}
                />
              </div>
            </div>

            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <span className="label-md">Frequency</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeProfile.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="text-[12px] text-content-2"
                  >
                    {activeProfile.soundDescription}
                  </motion.span>
                </AnimatePresence>
              </div>
              <AudioVisualizerWave height={54} />
            </div>

            <div className="card-inset p-4">
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <span className="label-md">Type here</span>
                <div className="flex items-center gap-2">
                  <TestButton
                    label="Spacebar"
                    onClick={() =>
                      audioEngine.playKeystroke(57, 'press', profileId)
                    }
                  />
                  <TestButton
                    label="Enter"
                    onClick={() =>
                      audioEngine.playKeystroke(28, 'press', profileId)
                    }
                  />
                </div>
              </div>

              <textarea
                placeholder="Click in and type — you'll hear the downstroke and the release, panned to where each key sits."
                rows={3}
                className="w-full resize-none rounded-md border border-line bg-surface p-3 text-[13px] leading-relaxed text-content placeholder:text-content-3 focus:outline-none"
                style={{ transition: 'border-color 0.2s var(--ease-out)' }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--accent-line)')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--border)')
                }
              />

              <p className="mt-2.5 text-[11.5px] text-content-3">
                Headphones recommended — the stereo placement is the good part.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ── Bits ───────────────────────────────────────────────────────────

function SegmentedTabs({
  value,
  onChange,
}: {
  value: 'all' | SwitchType;
  onChange: (v: 'all' | SwitchType) => void;
}) {
  return (
    <div className="segment">
      {TABS.map((tab) => {
        const isActive = value === tab;
        const count =
          tab === 'all'
            ? switchProfiles.length
            : switchProfiles.filter((p) => p.type === tab).length;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            data-active={isActive}
            className="segment-item capitalize"
          >
            {isActive && (
              <motion.span
                layoutId="sandbox-tab"
                className="absolute inset-0 rounded-[6px] bg-surface shadow-xs"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">
              {tab}{' '}
              <span className="tabular-nums opacity-50">{count}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TestButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className="rounded-sm border border-line bg-surface px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-content-2 transition-colors hover:border-line-strong hover:text-content"
    >
      {label}
    </motion.button>
  );
}
