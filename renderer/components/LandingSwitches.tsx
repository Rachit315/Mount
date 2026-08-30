'use client';

import { useState } from 'react';
import { switchProfiles, SwitchType } from '@/lib/switch-profiles';
import { audioEngine } from '@/lib/audio-engine';

export function LandingSwitches() {
  const [filter, setFilter] = useState<'all' | SwitchType>('all');
  const [auditioningId, setAuditioningId] = useState<string | null>(null);

  const filteredProfiles = filter === 'all'
    ? switchProfiles
    : switchProfiles.filter((p) => p.type === filter);

  const handleAudition = (profileId: string) => {
    setAuditioningId(profileId);
    audioEngine.playKeystroke(30, 'press', profileId);
    setTimeout(() => {
      audioEngine.playKeystroke(30, 'release', profileId);
      setTimeout(() => setAuditioningId(null), 200);
    }, 120);
  };

  return (
    <section id="switches" className="py-20 px-6 max-w-[1240px] mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#00AFFF] mb-2 uppercase">
            <span>[ MODULE // 02 ]</span>
            <span>&bull;</span>
            <span>Hardware Switch Matrix</span>
          </div>
          <h3 className="display-md text-[#FFFFFF]">
            13 Sampled Hardware Switch Packs
          </h3>
          <p className="body-md text-[#A1A1AA] text-sm mt-1 max-w-xl">
            High-fidelity recordings capturing row-accurate downstrokes and return release acoustics.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#18181B] rounded-[2px] border border-[#27272A] self-start sm:self-auto">
          {(['all', 'linear', 'tactile', 'clicky'] as const).map((tab) => {
            const isActive = filter === tab;
            const count = tab === 'all'
              ? switchProfiles.length
              : switchProfiles.filter((p) => p.type === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-1.5 px-3 text-[11px] font-mono font-semibold rounded-[2px] uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00AFFF] text-[#000000] shadow-sm font-bold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
                }`}
              >
                {tab} [{count}]
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((p) => {
          const isAuditioning = auditioningId === p.id;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-[2px] bg-[#18181B] border transition-all duration-200 flex flex-col justify-between ${
                isAuditioning
                  ? 'border-[#00AFFF] shadow-[0_0_20px_rgba(0,175,255,0.25)]'
                  : 'border-[#27272A] hover:border-[#3F3F46]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <div>
                      <h4 className="text-[14px] font-mono font-semibold text-[#FFFFFF] leading-tight">
                        {p.name}
                      </h4>
                      <span className="text-[11px] font-mono text-[#71717A]">
                        {p.brand}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-[#00AFFF] uppercase px-2 py-0.5 rounded-[2px] bg-[#00AFFF]/10 border border-[#00AFFF]/20">
                    {p.type}
                  </span>
                </div>

                <p className="text-[12px] text-[#A1A1AA] mb-4 font-mono leading-relaxed">
                  {p.description}
                </p>

                {/* Telemetry Matrix */}
                <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-3 flex flex-col gap-2 text-[11px] font-mono mb-4">
                  <div className="flex justify-between text-[#71717A]">
                    <span>// FORCE_SPEC</span>
                    <span className="text-[#FFFFFF] font-medium">{p.actuation} / {p.bottomOut}</span>
                  </div>
                  <div className="flex justify-between text-[#71717A]">
                    <span>// ACOUSTIC_PROFILE</span>
                    <span className="text-[#00AFFF] font-medium">{p.tag}</span>
                  </div>
                  <div className="flex justify-between text-[#71717A]">
                    <span>// SAMPLE_MANIFEST</span>
                    <span className="text-[#FFFFFF]">
                      {p.files.press.length} Press + {p.files.release.length} Release
                    </span>
                  </div>
                </div>
              </div>

              {/* Audition Button */}
              <button
                onClick={() => handleAudition(p.id)}
                className={`w-full py-2.5 px-3 rounded-[2px] text-[12px] font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  isAuditioning
                    ? 'bg-[#00AFFF] text-[#000000] border-[#00AFFF] shadow-[0_0_15px_rgba(0,175,255,0.4)]'
                    : 'bg-[#111113] hover:bg-[#27272A] text-[#FFFFFF] border-[#27272A]'
                }`}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <span>{isAuditioning ? 'PLAYING SAMPLE...' : 'AUDITION KEYSTROKE'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
