'use client';

import { useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/audio-engine';

interface AudioVisualizerWaveProps {
  height?: number;
  className?: string;
}

export function AudioVisualizerWave({ height = 36, className = '' }: AudioVisualizerWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const freqData = new Uint8Array(64);

    // Number of visualizer bars
    const barCount = 42;
    // Envelope / decay heights for smooth, snappy physics
    const currentHeights = new Float32Array(barCount).fill(0);
    const peakHeights = new Float32Array(barCount).fill(0);
    const peakSpeeds = new Float32Array(barCount).fill(0);

    let displayWidth = 340;
    let displayHeight = height;

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      displayWidth = Math.max(100, Math.floor(rect.width));
      displayHeight = height;

      const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    resize();

    const render = () => {
      time += 0.04;
      audioEngine.getAnalyserData(freqData);

      // Check if there is active audio energy
      let totalEnergy = 0;
      for (let i = 0; i < freqData.length; i++) {
        totalEnergy += freqData[i];
      }
      const avgEnergy = totalEnergy / freqData.length;
      const isAudioActive = avgEnergy > 2.5;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Calculate bar widths and gaps
      const totalGaps = barCount - 1;
      const gap = Math.max(2, Math.min(4, displayWidth / 120));
      const totalGapWidth = totalGaps * gap;
      const barWidth = Math.max(2, (displayWidth - totalGapWidth - 12) / barCount);
      const startX = (displayWidth - (barCount * barWidth + totalGaps * gap)) / 2;

      // Draw horizontal baseline reference line
      ctx.beginPath();
      ctx.moveTo(startX, displayHeight / 2);
      ctx.lineTo(startX + barCount * (barWidth + gap) - gap, displayHeight / 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < barCount; i++) {
        // Map bar index to frequency spectrum
        const freqIndex = Math.min(
          freqData.length - 1,
          Math.floor(Math.pow(i / barCount, 1.2) * (freqData.length - 1)),
        );
        const rawValue = freqData[freqIndex] || 0;
        const normalizedFreq = Math.min(1, rawValue / 200);

        // Ambient idle undulating wave (sine harmonics)
        const centerDist = Math.abs(i - barCount / 2) / (barCount / 2);
        const centerBell = Math.cos(centerDist * (Math.PI / 2.2));
        const idleWave = (
          Math.sin(time * 1.5 + i * 0.28) * 0.4 +
          Math.cos(time * 0.9 - i * 0.18) * 0.35 +
          0.5
        ) * centerBell * 0.28;

        // Combine audio FFT with ambient wave
        const targetNormalized = Math.max(idleWave, normalizedFreq * 1.3);
        const targetHeight = Math.max(3, targetNormalized * (displayHeight - 8));

        // Physics: fast attack, smooth exponential decay
        if (targetHeight > currentHeights[i]) {
          currentHeights[i] = targetHeight; // Instant snap on keystroke strike
        } else {
          currentHeights[i] += (targetHeight - currentHeights[i]) * 0.18; // Smooth decay
        }

        const h = Math.min(displayHeight - 4, currentHeights[i]);

        // Peak hold physics
        if (h >= peakHeights[i]) {
          peakHeights[i] = h;
          peakSpeeds[i] = 0;
        } else {
          peakSpeeds[i] += 0.35; // Gravity
          peakHeights[i] = Math.max(h, peakHeights[i] - peakSpeeds[i]);
        }

        const x = startX + i * (barWidth + gap);
        const y = (displayHeight - h) / 2;

        // Bar styling
        const barActive = normalizedFreq > 0.06 || isAudioActive;
        const gradient = ctx.createLinearGradient(x, y, x, y + h);

        if (barActive) {
          gradient.addColorStop(0, '#59CBFF');
          gradient.addColorStop(0.5, '#00AFFF');
          gradient.addColorStop(1, '#0077CC');
          ctx.fillStyle = gradient;
          ctx.shadowColor = '#00AFFF';
          ctx.shadowBlur = Math.min(12, normalizedFreq * 16);
        } else {
          gradient.addColorStop(0, 'rgba(0, 175, 255, 0.4)');
          gradient.addColorStop(0.5, 'rgba(0, 175, 255, 0.25)');
          gradient.addColorStop(1, 'rgba(39, 39, 42, 0.6)');
          ctx.fillStyle = gradient;
          ctx.shadowBlur = 0;
        }

        // Draw rounded rectangle bar
        const radius = Math.min(barWidth / 2, 2);
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, h, radius);
        } else {
          ctx.rect(x, y, barWidth, h);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw glowing peak cap dot when active or high peak
        if (peakHeights[i] > 6) {
          const peakY = (displayHeight - peakHeights[i]) / 2;
          ctx.fillStyle = barActive ? '#FFFFFF' : 'rgba(0, 175, 255, 0.7)';
          ctx.fillRect(x, Math.max(1, peakY - 1), barWidth, 1.5);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      className={`w-full relative flex items-center justify-center overflow-hidden rounded-[2px] bg-[#18181B] border border-[#27272A] p-1.5 shadow-inner ${className}`}
      style={{ minHeight: `${height}px` }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
