'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { audioEngine } from './audio-engine';
import { webKeyToScanCode } from './spatial-audio';

interface UseKeyboardEventsOptions {
  enabled: boolean;
  profileId: string;
}

/**
 * React hook that listens for keystroke events (via Electron IPC or
 * browser fallback in dev mode) and plays sounds through the audio engine.
 *
 * Returns live state for the visualizer.
 */
export function useKeyboardEvents({ enabled, profileId }: UseKeyboardEventsOptions) {
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [lastKey, setLastKey] = useState<number | null>(null);

  const enabledRef = useRef(enabled);
  const profileIdRef = useRef(profileId);

  // Keep refs in sync so the event callbacks always read the latest values
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    profileIdRef.current = profileId;
    audioEngine.setProfile(profileId);
  }, [profileId]);

  // Initialise audio engine once
  useEffect(() => {
    audioEngine.initialize();
    audioEngine.preloadProfile(profileId);
  }, [profileId]);

  // ── Keystroke handler (shared by IPC and browser fallback) ──────────
  const handleKeyDown = useCallback((keycode: number) => {
    if (!enabledRef.current) return;

    audioEngine.playKeystroke(keycode, 'press', profileIdRef.current);

    setPressedKeys((prev) => new Set(prev).add(keycode));
    setKeystrokeCount((c) => c + 1);
    setLastKey(keycode);
  }, []);

  const handleKeyUp = useCallback((keycode: number) => {
    if (enabledRef.current) {
      audioEngine.playKeystroke(keycode, 'release', profileIdRef.current);
    }

    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(keycode);
      return next;
    });
  }, []);

  // ── Electron IPC path ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If running inside Electron (preload exposed window.mount)
    if (window.mount) {
      const cleanup = window.mount.onKeystroke((event) => {
        if (event.type === 'keydown') {
          handleKeyDown(event.keycode);
        } else {
          handleKeyUp(event.keycode);
        }
      });
      return cleanup;
    }

    // ── Browser fallback (dev mode without Electron) ─────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const sc = webKeyToScanCode[e.code];
      if (sc !== undefined) handleKeyDown(sc);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const sc = webKeyToScanCode[e.code];
      if (sc !== undefined) handleKeyUp(sc);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { pressedKeys, keystrokeCount, lastKey };
}
