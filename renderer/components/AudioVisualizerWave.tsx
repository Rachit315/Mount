'use client';

import { useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/audio-engine';
import { useTheme } from '@/lib/theme';

interface AudioVisualizerWaveProps {
  height?: number;
  className?: string;
  /** Draw on a bare background instead of an inset panel. */
  bare?: boolean;
}

/** Reads a CSS custom property off <html> as a concrete colour string. */
function cssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

export function AudioVisualizerWave({
  height = 40,
  className = '',
  bare = false,
}: AudioVisualizerWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Palette is resolved once per theme change rather than every frame.
    const accent = cssVar('--accent', '#b0524a');
    const idle = cssVar('--text-3', '#8b8578');
    const baseline = cssVar('--border', '#ded8c7');

    let animationId: number;
    let time = 0;
    const freqData = new Uint8Array(64);

    const barCount = 48;
    const currentHeights = new Float32Array(barCount).fill(0);
    const peakHeights = new Float32Array(barCount).fill(0);
    const peakSpeeds = new Float32Array(barCount).fill(0);

    let displayWidth = 0;
    const displayHeight = height;

    // Only the observed *width* feeds back into the canvas, and only when it
    // actually changes — resizing the canvas inside its own observer callback
    // otherwise loops forever and starves the compositor.
    const resize = () => {
      const w = Math.max(100, Math.floor(container.clientWidth));
      if (w === displayWidth) return;
      displayWidth = w;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const render = () => {
      time += 0.04;
      audioEngine.getAnalyserData(freqData);

      let totalEnergy = 0;
      for (let i = 0; i < freqData.length; i++) totalEnergy += freqData[i];
      const isAudioActive = totalEnergy / freqData.length > 2.5;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const gap = Math.max(2, Math.min(4, displayWidth / 140));
      const totalGapWidth = (barCount - 1) * gap;
      const barWidth = Math.max(2, (displayWidth - totalGapWidth - 10) / barCount);
      const startX =
        (displayWidth - (barCount * barWidth + totalGapWidth)) / 2;
      const mid = displayHeight / 2;

      // Baseline
      ctx.beginPath();
      ctx.moveTo(startX, mid);
      ctx.lineTo(startX + barCount * (barWidth + gap) - gap, mid);
      ctx.strokeStyle = baseline;
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < barCount; i++) {
        const freqIndex = Math.min(
          freqData.length - 1,
          Math.floor(Math.pow(i / barCount, 1.2) * (freqData.length - 1)),
        );
        const normalizedFreq = Math.min(1, (freqData[freqIndex] || 0) / 200);

        // Gentle idle undulation so the strip never looks dead
        const centerDist = Math.abs(i - barCount / 2) / (barCount / 2);
        const centerBell = Math.cos(centerDist * (Math.PI / 2.2));
        const idleWave =
          (Math.sin(time * 1.4 + i * 0.26) * 0.4 +
            Math.cos(time * 0.85 - i * 0.17) * 0.35 +
            0.5) *
          centerBell *
          0.3;

        const target = Math.max(idleWave, normalizedFreq * 1.3);
        const targetHeight = Math.max(3, target * (displayHeight - 8));

        if (targetHeight > currentHeights[i]) {
          currentHeights[i] = targetHeight; // snap on strike
        } else {
          currentHeights[i] += (targetHeight - currentHeights[i]) * 0.17;
        }

        const h = Math.min(displayHeight - 4, currentHeights[i]);

        if (h >= peakHeights[i]) {
          peakHeights[i] = h;
          peakSpeeds[i] = 0;
        } else {
          peakSpeeds[i] += 0.35;
          peakHeights[i] = Math.max(h, peakHeights[i] - peakSpeeds[i]);
        }

        const x = startX + i * (barWidth + gap);
        const y = (displayHeight - h) / 2;
        const barActive = normalizedFreq > 0.06 || isAudioActive;

        ctx.fillStyle = barActive ? accent : idle;
        ctx.globalAlpha = barActive ? 1 : 0.7;

        ctx.beginPath();
        const radius = Math.min(barWidth / 2, 2);
        if (ctx.roundRect) ctx.roundRect(x, y, barWidth, h, radius);
        else ctx.rect(x, y, barWidth, h);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [height, theme]);

  return (
    <div
      ref={containerRef}
      className={`relative flex w-full items-center justify-center overflow-hidden ${
        bare ? '' : 'card-inset'
      } ${className}`}
      style={{ height: height + (bare ? 0 : 12), padding: bare ? 0 : 6 }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
