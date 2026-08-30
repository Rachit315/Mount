'use client';

import { useState, useCallback } from 'react';
import { switchProfiles, SwitchType } from '@/lib/switch-profiles';
import { audioEngine } from '@/lib/audio-engine';
import { useKeyboardEvents } from '@/lib/use-keyboard-events';
import { TonePitchPad } from '@/components/TonePitchPad';
import { Visualizer } from '@/components/Visualizer';
import { VolumeControl } from '@/components/VolumeControl';
import { AudioVisualizerWave } from '@/components/AudioVisualizerWave';

export function LandingSandbox() {
  const [selectedProfile, setSelectedProfile] = useState('alpaca');
  const [filter, setFilter] = useState<'all' | SwitchType>('all');
  const [volume, setVolume] = useState(0.8);
  const [toneX, setToneX] = useState(0.5);
  const [pitchY, setPitchY] = useState(0.5);

  const { pressedKeys, keystrokeCount } = useKeyboardEvents({
    enabled: true,
    profileId: selectedProfile,
  });

  const activeProfile = switchProfiles.find((p) => p.id === selectedProfile) || switchProfiles[0];

  const filteredProfiles = filter === 'all'
    ? switchProfiles
    : switchProfiles.filter((p) => p.type === filter);

  const handleVolume = useCallback((v: number) => {
    setVolume(v);
    audioEngine.setVolume(v);
  }, []);

  const handleTonePitch = useCallback((tx: number, py: number) => {
    setToneX(tx);
    setPitchY(py);
    audioEngine.setTone(tx);
    audioEngine.setPitch(py);
  }, []);

  const triggerTestSound = (keycode = 30, action: 'press' | 'release' = 'press') => {
    audioEngine.playKeystroke(keycode, action, selectedProfile);
  };

  return (
    <section id="sandbox" className="py-20 px-6 max-w-[1240px] mx-auto relative z-10">
      {/* Section Header */}
      <div className="mb-10 text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#00AFFF] mb-2 uppercase">
            <span>[ MODULE // 01 ]</span>
            <span>&bull;</span>
            <span>Acoustic Emulation Sandbox</span>
          </div>
          <h3 className="display-md text-[#FFFFFF]">
            Interactive Sound Engine
          </h3>
          <p className="body-md text-[#A1A1AA] text-sm mt-1 max-w-xl">
            Type freely on your physical keyboard to audition all 13 sampled hardware switch models in real time.
          </p>
        </div>

        <div className="font-mono text-[12px] text-[#A1A1AA] bg-[#18181B] border border-[#27272A] px-3.5 py-1.5 rounded-[2px] self-start md:self-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00AFFF]" />
          <span>STATUS: ONLINE // &lt;10MS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#18181B] border border-[#27272A] rounded-[2px] p-6 sm:p-8 shadow-2xl">
        {/* Left column: Switch selector & 2D pad */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label-md text-[#A1A1AA]">
                // SELECT_SWITCH_PROFILE
              </span>
              <span className="label-md text-[#00AFFF]">
                {activeProfile.name}
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 mb-2.5 p-1 bg-[#111113] rounded-[2px] border border-[#27272A]">
              {(['all', 'linear', 'tactile', 'clicky'] as const).map((tab) => {
                const isActive = filter === tab;
                const count = tab === 'all'
                  ? switchProfiles.length
                  : switchProfiles.filter((p) => p.type === tab).length;

                return (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`flex-1 py-1 px-2 text-[10px] font-mono font-semibold rounded-[2px] uppercase transition-all cursor-pointer ${
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

            {/* Switch Cards Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredProfiles.map((p) => {
                const isSelected = p.id === selectedProfile;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProfile(p.id);
                      audioEngine.playKeystroke(30, 'press', p.id);
                    }}
                    className={`p-3 rounded-[2px] text-left cursor-pointer transition-all duration-150 relative border ${
                      isSelected
                        ? 'bg-[#27272A] border-[#00AFFF] shadow-[0_0_12px_rgba(0,175,255,0.2)]'
                        : 'bg-[#111113] border-[#27272A] hover:border-[#3F3F46]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-[12px] font-mono font-semibold text-[#FFFFFF] truncate">
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A1A1AA]">
                      <span className="uppercase">{p.type}</span>
                      <span className="text-[#00AFFF] text-[9px] px-1 py-0.2 bg-[#00AFFF]/10 rounded-[2px] border border-[#00AFFF]/20">
                        {p.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Control */}
          <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-2">
            <VolumeControl volume={volume} onChange={handleVolume} />
          </div>

          {/* 2D Tone & Pitch Pad */}
          <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-2">
            <TonePitchPad toneX={toneX} pitchY={pitchY} onChange={handleTonePitch} />
          </div>
        </div>

        {/* Right column: Interactive Visualizer & Real-time Analyzer */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label-md text-[#A1A1AA]">
                // LIVE_SPATIAL_KEY_MATRIX
              </span>
              <span className="font-mono text-[11px] text-[#00AFFF] tabular-nums">
                COUNT: {keystrokeCount.toLocaleString()} KEYS
              </span>
            </div>

            <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-2">
              <Visualizer
                pressedKeys={pressedKeys}
                accentColor="#00AFFF"
              />
            </div>
          </div>

          {/* Real-time Oscilloscope */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="label-md text-[#71717A]">
                // FREQUENCY_ANALYZER
              </span>
              <span className="font-mono text-[11px] text-[#00AFFF]">
                {activeProfile.name} &bull; {activeProfile.soundDescription}
              </span>
            </div>
            <AudioVisualizerWave height={38} />
          </div>

          {/* Typing test area */}
          <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="label-md text-[#FFFFFF]">
                // LIVE_KEYSTROKE_INPUT
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerTestSound(57, 'press')}
                  className="font-mono text-[11px] text-[#00AFFF] hover:underline cursor-pointer"
                >
                  [ SPACEBAR_TEST ]
                </button>
                <button
                  onClick={() => triggerTestSound(28, 'press')}
                  className="font-mono text-[11px] text-[#00AFFF] hover:underline cursor-pointer"
                >
                  [ ENTER_TEST ]
                </button>
              </div>
            </div>

            <textarea
              placeholder="Click here and type on your physical keyboard to audition live downstroke & release samples..."
              rows={3}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-[2px] p-3 text-xs text-[#FFFFFF] placeholder-[#71717A] focus:outline-none focus:border-[#00AFFF] focus:ring-1 focus:ring-[#00AFFF] resize-none transition-all font-mono"
            />

            <div className="flex items-center justify-between mt-2.5 font-mono text-[11px] text-[#71717A]">
              <span>Stereo headphones recommended for spatial audio</span>
              <span className="text-[#00AFFF]">// 13 HARDWARE PROFILES READY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
