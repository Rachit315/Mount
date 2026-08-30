// ─────────────────────────────────────────────────────────────────────────
// Web Audio Engine — Real Sampled Mechanical Keyboard Audio Engine
// ─────────────────────────────────────────────────────────────────────────

import { getProfileById, switchProfiles, SwitchProfile } from './switch-profiles';
import { getKeyPan } from './spatial-audio';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // In-memory decoded AudioBuffer cache: `profileId:action:file` -> AudioBuffer
  private bufferCache = new Map<string, AudioBuffer>();
  private pendingLoads = new Map<string, Promise<AudioBuffer | null>>();

  private volume = 0.8;
  private toneModifier = 0.5;  // 0 = deep warm thock, 1 = bright snappy clack
  private pitchModifier = 0.5; // 0 = low pitch, 1 = high pitch
  private currentProfileId = 'alpaca';

  // ── Lifecycle ───────────────────────────────────────────────────────

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        try {
          await this.ctx.resume();
        } catch {
          // ignore
        }
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Real-time audio analyzer for visualizers
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.5;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Preload active profile
      this.preloadProfile(this.currentProfileId);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  // ── AudioBuffer Loading & Caching ───────────────────────────────────

  private async loadAudioBuffer(profileId: string, action: 'press' | 'release', fileName: string): Promise<AudioBuffer | null> {
    if (typeof window === 'undefined') return null;

    const cacheKey = `${profileId}:${action}:${fileName}`;
    if (this.bufferCache.has(cacheKey)) {
      return this.bufferCache.get(cacheKey)!;
    }

    if (this.pendingLoads.has(cacheKey)) {
      return this.pendingLoads.get(cacheKey)!;
    }

    const loadPromise = (async () => {
      try {
        if (!this.ctx) await this.initialize();
        if (!this.ctx) return null;

        const url = `/audio/${profileId}/${action}/${fileName}.mp3`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.bufferCache.set(cacheKey, audioBuffer);
        return audioBuffer;
      } catch (err) {
        console.warn(`Could not load audio sample ${profileId}/${action}/${fileName}:`, err);
        return null;
      } finally {
        this.pendingLoads.delete(cacheKey);
      }
    })();

    this.pendingLoads.set(cacheKey, loadPromise);
    return loadPromise;
  }

  /** Preload all audio samples for a given switch profile */
  async preloadProfile(profileId: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const profile = getProfileById(profileId);
    if (!profile) return;

    const promises: Promise<unknown>[] = [];
    for (const f of profile.files.press) {
      promises.push(this.loadAudioBuffer(profileId, 'press', f));
    }
    for (const f of profile.files.release) {
      promises.push(this.loadAudioBuffer(profileId, 'release', f));
    }
    await Promise.all(promises);
  }

  // ── Keycode to Sample Resolver ──────────────────────────────────────

  private resolveSampleFile(
    profile: SwitchProfile,
    keycode: number,
    action: 'press' | 'release',
  ): string {
    const available = profile.files[action];

    if (action === 'press') {
      // 1. Check special keys
      if (keycode === 14 && available.includes('BACKSPACE')) return 'BACKSPACE';
      if (keycode === 28 && available.includes('ENTER')) return 'ENTER';
      if (keycode === 57 && available.includes('SPACE')) return 'SPACE';

      // 2. Map row-specific keys
      // Row 0: Number row (1–14)
      if (keycode >= 1 && keycode <= 14) {
        if (available.includes('GENERIC_R0')) return 'GENERIC_R0';
      }
      // Row 1: Tab + QWERTY row (15–27, 43)
      else if ((keycode >= 15 && keycode <= 27) || keycode === 43) {
        if (available.includes('GENERIC_R1')) return 'GENERIC_R1';
      }
      // Row 2: Caps + Home row (58, 30–40, 28)
      else if ((keycode >= 30 && keycode <= 40) || keycode === 58 || keycode === 28) {
        if (available.includes('GENERIC_R2')) return 'GENERIC_R2';
      }
      // Row 3: Shifts + Bottom letter row (42, 44–54)
      else if ((keycode >= 44 && keycode <= 54) || keycode === 42) {
        if (available.includes('GENERIC_R3')) return 'GENERIC_R3';
      }
      // Row 4: Space + Modifiers (29, 56, 57, 3640, 3613, etc.)
      else {
        if (available.includes('GENERIC_R4')) return 'GENERIC_R4';
      }

      // Fallbacks
      return available[0] || 'GENERIC_R0';
    } else {
      // Action === 'release'
      if (keycode === 14 && available.includes('BACKSPACE')) return 'BACKSPACE';
      if (keycode === 28 && available.includes('ENTER')) return 'ENTER';
      if (keycode === 57 && available.includes('SPACE')) return 'SPACE';
      if (available.includes('GENERIC')) return 'GENERIC';
      return available[0] || 'GENERIC';
    }
  }

  // ── Playback ────────────────────────────────────────────────────────

  async playKeystroke(
    keycode: number,
    action: 'press' | 'release' = 'press',
    profileId?: string,
  ): Promise<void> {
    if (typeof window === 'undefined') return;

    const targetProfileId = profileId || this.currentProfileId;
    const profile = getProfileById(targetProfileId) || switchProfiles[0];

    if (!this.ctx || !this.masterGain) {
      await this.initialize();
      if (!this.ctx || !this.masterGain) return;
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const sampleFileName = this.resolveSampleFile(profile, keycode, action);
    const buffer = await this.loadAudioBuffer(profile.id, action, sampleFileName);
    if (!buffer) return;

    const now = this.ctx.currentTime;
    const pan = getKeyPan(keycode);

    // Dynamic pitch modifier: 0 = 0.82x (deep pitch), 0.5 = 1.0x, 1 = 1.25x (sharp pitch)
    const pitchBase = 0.82 + this.pitchModifier * 0.43;
    // Per-keystroke organic variance (+/- 3%)
    const pitchVariation = 0.97 + Math.random() * 0.06;
    const playbackRate = pitchBase * pitchVariation;

    // Organic volume velocity variance (+/- 8%)
    const volumeVariation = 0.92 + Math.random() * 0.16;
    const actionVolumeScale = action === 'release' ? 0.72 : 1.0;

    // ── Output routing chain ──────────────────────────────────────────
    // Source -> Lowpass Tone Filter -> Stereo Panner -> Gain Node -> Analyser -> Master Gain -> Destination

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(playbackRate, now);

    // Tone shaping: Lowpass filter cutoff between 1,200 Hz (deep thock) and 16,000 Hz (bright clack)
    const toneFilter = this.ctx.createBiquadFilter();
    toneFilter.type = 'lowpass';
    const cutoffFreq = 1200 + Math.pow(this.toneModifier, 1.8) * 14800;
    toneFilter.frequency.setValueAtTime(cutoffFreq, now);
    toneFilter.Q.setValueAtTime(0.7, now);

    // Stereo panning
    const panner = this.ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, now);

    // Individual stroke gain node
    const strokeGain = this.ctx.createGain();
    const targetGain = actionVolumeScale * volumeVariation;
    strokeGain.gain.setValueAtTime(targetGain, now);

    source.connect(toneFilter);
    toneFilter.connect(panner);
    panner.connect(strokeGain);
    strokeGain.connect(this.masterGain);

    source.start(now);
  }

  // ── Visualizer hook data ────────────────────────────────────────────

  getAnalyserData(freqArray: Uint8Array): void {
    if (typeof window === 'undefined') return;
    if (this.analyser) {
      this.analyser.getByteFrequencyData(freqArray as any);
    }
  }

  // ── Control setters ─────────────────────────────────────────────────

  setProfile(profileId: string): void {
    this.currentProfileId = profileId;
    if (typeof window !== 'undefined') {
      this.preloadProfile(profileId);
    }
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.01);
    }
  }

  setTone(v: number): void {
    this.toneModifier = Math.max(0, Math.min(1, v));
  }

  setPitch(v: number): void {
    this.pitchModifier = Math.max(0, Math.min(1, v));
  }

  getVolume(): number  { return this.volume; }
  getTone(): number    { return this.toneModifier; }
  getPitch(): number   { return this.pitchModifier; }
  getProfile(): string { return this.currentProfileId; }

  destroy(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.bufferCache.clear();
  }
}

/** Singleton audio engine — shared across the renderer. */
export const audioEngine = new AudioEngine();
