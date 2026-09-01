'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { audioEngine } from './audio-engine';
import { useKeyboardEvents } from './use-keyboard-events';

interface SoundSession {
  profileId: string;
  setProfileId: (id: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  toneX: number;
  pitchY: number;
  setTonePitch: (toneX: number, pitchY: number) => void;
  pressedKeys: Set<number>;
  keystrokeCount: number;
}

const SoundSessionContext = createContext<SoundSession | null>(null);

/**
 * Owns the single keystroke listener for the landing page. Mounting
 * `useKeyboardEvents` more than once would play every sample twice, so the
 * hero board and the sandbox both read from here instead.
 */
export function SoundSessionProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileIdState] = useState('alpaca');
  const [volume, setVolumeState] = useState(0.8);
  const [toneX, setToneX] = useState(0.5);
  const [pitchY, setPitchY] = useState(0.5);

  const { pressedKeys, keystrokeCount } = useKeyboardEvents({
    enabled: true,
    profileId,
  });

  const setProfileId = useCallback((id: string) => {
    setProfileIdState(id);
    audioEngine.playKeystroke(30, 'press', id);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    audioEngine.setVolume(v);
  }, []);

  const setTonePitch = useCallback((tx: number, py: number) => {
    setToneX(tx);
    setPitchY(py);
    audioEngine.setTone(tx);
    audioEngine.setPitch(py);
  }, []);

  return (
    <SoundSessionContext.Provider
      value={{
        profileId,
        setProfileId,
        volume,
        setVolume,
        toneX,
        pitchY,
        setTonePitch,
        pressedKeys,
        keystrokeCount,
      }}
    >
      {children}
    </SoundSessionContext.Provider>
  );
}

export function useSoundSession(): SoundSession {
  const ctx = useContext(SoundSessionContext);
  if (!ctx) {
    throw new Error('useSoundSession must be used inside <SoundSessionProvider>');
  }
  return ctx;
}
