'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { SwitchSelector } from '@/components/SwitchSelector';
import { VolumeControl } from '@/components/VolumeControl';
import { TonePitchPad } from '@/components/TonePitchPad';
import { Visualizer } from '@/components/Visualizer';
import { StatusBar } from '@/components/StatusBar';
import { AudioVisualizerWave } from '@/components/AudioVisualizerWave';

import { useKeyboardEvents } from '@/lib/use-keyboard-events';
import { audioEngine } from '@/lib/audio-engine';
import { getProfileById } from '@/lib/switch-profiles';

export default function AppPage() {
  // ── State ──────────────────────────────────────────────────────────
  const [enabled, setEnabled] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState('alpaca');
  const [volume, setVolume] = useState(0.8);
  const [toneX, setToneX] = useState(0.5);
  const [pitchY, setPitchY] = useState(0.5);
  const [loaded, setLoaded] = useState(false);

  // ── Keyboard events → audio + visualizer ───────────────────────────
  const { pressedKeys, keystrokeCount } = useKeyboardEvents({
    enabled,
    profileId: selectedProfile,
  });

  const profile = getProfileById(selectedProfile);

  // ── Load persisted settings ────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mount) {
      window.mount.getSettings().then((s) => {
        if (s) {
          setEnabled(s.enabled);
          setSelectedProfile(s.selectedProfile);
          setVolume(s.volume);
          setToneX(s.toneX);
          setPitchY(s.pitchY);
          audioEngine.setVolume(s.volume);
          audioEngine.setTone(s.toneX);
          audioEngine.setPitch(s.pitchY);
        }
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, []);

  // ── Persist settings on change ─────────────────────────────────────
  const saveSettings = useCallback(() => {
    if (typeof window !== 'undefined' && window.mount) {
      window.mount.saveSettings({
        enabled,
        selectedProfile,
        volume,
        toneX,
        pitchY,
      });
    }
  }, [enabled, selectedProfile, volume, toneX, pitchY]);

  useEffect(() => {
    if (loaded) saveSettings();
  }, [saveSettings, loaded]);

  // ── Sync enabled state with main process ───────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mount) {
      window.mount.setEnabled(enabled);
    }
  }, [enabled]);

  // ── Control handlers ───────────────────────────────────────────────
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

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#000000]">
        <div className="w-5 h-5 rounded-[2px] border-2 border-[#00AFFF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#000000] overflow-hidden text-[#FFFFFF] select-none font-mono">
      <div className="flex flex-col h-full bg-[#000000]">
        {/* Navigation link for browser preview mode */}
        {typeof window !== 'undefined' && !window.mount && (
          <div className="bg-[#18181B] px-4 py-1.5 flex items-center justify-between text-[10px] border-b border-[#27272A]">
            <span className="text-[#A1A1AA]">// TRAY_POPOVER_MODE</span>
            <Link href="/" className="text-[#00AFFF] hover:underline">
              [ LANDING_PAGE &rarr; ]
            </Link>
          </div>
        )}

        <Header enabled={enabled} onToggle={setEnabled} />

        {/* Live Audio Frequency Spectrum */}
        <div className="px-5 pt-2">
          <AudioVisualizerWave height={32} />
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-1 space-y-1">
          <SwitchSelector
            selectedId={selectedProfile}
            onSelect={setSelectedProfile}
          />

          <VolumeControl volume={volume} onChange={handleVolume} />

          <TonePitchPad
            toneX={toneX}
            pitchY={pitchY}
            onChange={handleTonePitch}
          />

          <Visualizer
            pressedKeys={pressedKeys}
            accentColor={profile?.color || '#00AFFF'}
          />
        </div>

        <StatusBar
          profileName={profile?.name || 'Alpaca Linear'}
          keystrokeCount={keystrokeCount}
          enabled={enabled}
        />
      </div>
    </div>
  );
}
