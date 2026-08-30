'use client';

import { useState } from 'react';
import { switchProfiles, SwitchType } from '@/lib/switch-profiles';
import { audioEngine } from '@/lib/audio-engine';

interface SwitchSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SwitchSelector({ selectedId, onSelect }: SwitchSelectorProps) {
  const [filter, setFilter] = useState<'all' | SwitchType>('all');

  const filteredProfiles = filter === 'all'
    ? switchProfiles
    : switchProfiles.filter((p) => p.type === filter);

  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="label-md text-[#A1A1AA]">
          // SWITCH_PROFILE
        </span>
        <span className="font-mono text-[10px] text-[#71717A]">
          {switchProfiles.length} REAL PACKS
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-2.5 p-0.5 bg-[#111113] rounded-[2px] border border-[#27272A]">
        {(['all', 'linear', 'tactile', 'clicky'] as const).map((tab) => {
          const isActive = filter === tab;
          const count = tab === 'all'
            ? switchProfiles.length
            : switchProfiles.filter((p) => p.type === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-1 px-1.5 text-[9px] font-mono font-semibold rounded-[2px] uppercase transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00AFFF] text-[#000000] font-bold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-white/[0.03]'
              }`}
            >
              {tab} [{count}]
            </button>
          );
        })}
      </div>

      {/* Grid of Switch Profiles */}
      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin">
        {filteredProfiles.map((profile) => {
          const isSelected = profile.id === selectedId;
          return (
            <button
              key={profile.id}
              onClick={() => {
                onSelect(profile.id);
                audioEngine.playKeystroke(30, 'press', profile.id);
              }}
              className={`p-2.5 rounded-[2px] text-left cursor-pointer transition-all duration-150 relative border ${
                isSelected
                  ? 'bg-[#27272A] border-[#00AFFF] shadow-[0_0_12px_rgba(0,175,255,0.2)]'
                  : 'bg-[#18181B] border-[#27272A] hover:border-[#3F3F46]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: profile.color }}
                  />
                  <span className="text-[11px] font-mono font-semibold text-[#FFFFFF] leading-none truncate">
                    {profile.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-[#A1A1AA] uppercase">
                  {profile.type} &bull; {profile.actuation}
                </span>
                <span className="text-[#00AFFF] px-1 py-0.2 bg-[#00AFFF]/10 rounded-[2px]">
                  {profile.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
