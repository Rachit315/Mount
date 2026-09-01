'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';

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

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AppPage() {
  // ── State ──────────────────────────────────────────────────────────
  const [enabled, setEnabled] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState('alpaca');
  const [volume, setVolume] = useState(0.8);
  const [toneX, setToneX] = useState(0.5);
  const [pitchY, setPitchY] = useState(0.5);
  const [loaded, setLoaded] = useState(false);
  const [isElectron, setIsElectron] = useState(true);

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
      setIsElectron(false);
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
      <div className="flex h-screen items-center justify-center bg-bg">
        <motion.div
          className="h-6 w-6 rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen select-none flex-col overflow-hidden bg-bg text-content">
      {/* Browser-preview banner */}
      {!isElectron && (
        <Link
          href="/"
          className="flex flex-shrink-0 items-center justify-between border-b border-line px-4 py-1.5 text-[11px]"
          style={{ backgroundColor: 'var(--surface-2)' }}
        >
          <span className="text-content-2">Web preview of the tray app</span>
          <span style={{ color: 'var(--accent)' }}>Back to site →</span>
        </Link>
      )}

      <Header enabled={enabled} onToggle={setEnabled} />

      {/* Live spectrum */}
      <div className="flex-shrink-0 px-4 pt-3">
        <AudioVisualizerWave height={38} />
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="scrollbar-hide flex-1 overflow-y-auto pb-1 pt-1"
      >
        <AnimatePresence initial={false}>
          {!enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="overflow-hidden px-4 pt-2"
            >
              <div
                className="rounded-md border px-3 py-2 text-[11.5px]"
                style={{
                  borderColor: 'var(--accent-line)',
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                Sound is muted — flip the switch up top to bring it back.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
          accentColor={profile?.color || 'var(--accent)'}
          unit={23}
        />
      </motion.div>

      <StatusBar
        profileName={profile?.name || 'Alpaca Linear'}
        keystrokeCount={keystrokeCount}
        enabled={enabled}
      />
    </div>
  );
}
