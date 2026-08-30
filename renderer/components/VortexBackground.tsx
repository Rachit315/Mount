'use client';

import { useEffect, useRef } from 'react';

export function VortexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Vortex Particle System
    const particleCount = Math.min(120, Math.floor((width * height) / 12000));
    const particles: Array<{
      angle: number;
      radius: number;
      speed: number;
      size: number;
      alpha: number;
      z: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * (Math.max(width, height) * 0.65),
        speed: (0.001 + Math.random() * 0.0025) * (Math.random() > 0.5 ? 1 : -1),
        size: 1 + Math.random() * 2,
        alpha: 0.15 + Math.random() * 0.45,
        z: Math.random(),
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.42;

      // 1. Central Ambient Atmospheric Glow (#00AFFF)
      const radialGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.max(width, height) * 0.6,
      );
      radialGlow.addColorStop(0, 'rgba(0, 175, 255, 0.12)');
      radialGlow.addColorStop(0.35, 'rgba(0, 175, 255, 0.04)');
      radialGlow.addColorStop(0.7, 'rgba(24, 24, 27, 0.4)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Concentric Orbit Rings
      const ringCount = 5;
      for (let r = 1; r <= ringCount; r++) {
        const ringRadius = r * (Math.min(width, height) * 0.13);
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 175, 255, ${0.03 + (r % 2 === 0 ? 0.02 : 0.01)})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 12]);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 3. Rotating Vortex Spiral Rays
      const rayCount = 6;
      for (let i = 0; i < rayCount; i++) {
        const rayAngle = (i * (Math.PI * 2)) / rayCount + time * 0.15;
        const gradient = ctx.createLinearGradient(
          centerX,
          centerY,
          centerX + Math.cos(rayAngle) * width * 0.7,
          centerY + Math.sin(rayAngle) * height * 0.7,
        );
        gradient.addColorStop(0, 'rgba(0, 175, 255, 0.06)');
        gradient.addColorStop(0.5, 'rgba(0, 175, 255, 0.01)');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(rayAngle - 0.2) * width * 0.8,
          centerY + Math.sin(rayAngle - 0.2) * height * 0.8,
        );
        ctx.lineTo(
          centerX + Math.cos(rayAngle + 0.2) * width * 0.8,
          centerY + Math.sin(rayAngle + 0.2) * height * 0.8,
        );
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // 4. Inward Accretion Particles
      for (const p of particles) {
        p.angle += p.speed;
        p.radius -= 0.15;
        if (p.radius < 30) {
          p.radius = Math.max(width, height) * 0.65;
          p.angle = Math.random() * Math.PI * 2;
        }

        const px = centerX + Math.cos(p.angle) * p.radius;
        const py = centerY + Math.sin(p.angle) * (p.radius * 0.75);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 175, 255, ${p.alpha})`;
        ctx.shadowColor = '#00AFFF';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block opacity-85" />
      {/* Precision Grid Layer */}
      <div className="absolute inset-0 vortex-grid-bg opacity-30 pointer-events-none" />
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
    </div>
  );
}
