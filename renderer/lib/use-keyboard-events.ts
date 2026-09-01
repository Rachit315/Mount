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
 * browser fallback in web mode) and plays sounds through the audio engine.
 *
 * Returns live state for the visualizer.
 */
export function useKeyboardEvents({ enabled, profileId }: UseKeyboardEventsOptions) {
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [lastKey, setLastKey] = useState<number | null>(null);

  const enabledRef = useRef(enabled);
  const profileIdRef = useRef(profileId);

  // Keycodes physically held down right now. The OS emits repeated keydown
  // events while a key is held; only the first is a real keystroke.
  const heldKeys = useRef<Set<number>>(new Set());

  // Keep refs in sync so the event callbacks always read the latest values
  useEffect(() => {
    enabledRef.current = enabled;
    // Muting mid-press would otherwise leave that key stuck in `heldKeys`,
    // since its keyup arrives while the engine is off.
    if (!enabled) {
      heldKeys.current.clear();
      setPressedKeys(new Set());
    }
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

    // Hold a key and the OS auto-repeats keydown ~30x/sec. Ignore every repeat
    // until the matching keyup. Because this is tracked per keycode, chords
    // still behave: Ctrl, Shift and the letter each fire once, together.
    if (heldKeys.current.has(keycode)) return;
    heldKeys.current.add(keycode);

    audioEngine.playKeystroke(keycode, 'press', profileIdRef.current);

    setPressedKeys((prev) => new Set(prev).add(keycode));
    setKeystrokeCount((c) => c + 1);
    setLastKey(keycode);
  }, []);

  const handleKeyUp = useCallback((keycode: number) => {
    // Only sound the release for a press we actually voiced, so a stray keyup
    // (key held while the app started, say) stays silent.
    const wasHeld = heldKeys.current.delete(keycode);

    if (enabledRef.current && wasHeld) {
      audioEngine.playKeystroke(keycode, 'release', profileIdRef.current);
    }

    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(keycode);
      return next;
    });
  }, []);

  // A keyup can go missing when the window loses focus mid-press (browser
  // path); without this the key would be stuck "down" and never sound again.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const release = () => {
      heldKeys.current.clear();
      setPressedKeys(new Set());
    };
    window.addEventListener('blur', release);
    return () => window.removeEventListener('blur', release);
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

    // ── Browser fallback (web mode outside Electron) ─────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // Auto resume AudioContext on first user interaction in browser
      audioEngine.initialize();
      const sc = webKeyToScanCode[e.code] ?? 30;
      handleKeyDown(sc);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const sc = webKeyToScanCode[e.code] ?? 30;
      handleKeyUp(sc);
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
