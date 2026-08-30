'use client';

import Link from 'next/link';
import { AudioVisualizerWave } from './AudioVisualizerWave';

interface LandingHeroProps {
  onOpenDownload: () => void;
}

export function LandingHero({ onOpenDownload }: LandingHeroProps) {
  return (
    <section className="relative pt-24 pb-20 px-6 text-center max-w-[1240px] mx-auto z-10">
      {/* Vortex System Tag */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-[2px] bg-[#18181B] border border-[#27272A] mb-8 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#00AFFF] animate-pulse" />
        <span className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider">
          [ VORTEX // CORE ] &bull; Absolute Synchronization
        </span>
      </div>

      {/* Neuform Display Headline */}
      <h1 className="display-lg text-[#FFFFFF] max-w-4xl mx-auto mb-6">
        Real mechanical keyboard sounds. <span className="text-[#00AFFF]">Anywhere on your PC.</span>
      </h1>

      {/* Subtitle */}
      <p className="body-md max-w-2xl mx-auto mb-10 text-[#A1A1AA]">
        Engineered for scale. Controlled by none. 13 authentic hardware switch sound packs with zero perceptible latency, physical stereo coordinates, and dual press/release sampling.
      </p>

      {/* Audio Wave Spectrum */}
      <div className="w-full max-w-lg mx-auto mb-10">
        <AudioVisualizerWave height={44} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
        <a
          href="https://github.com/Rachit315/Mount/releases/latest/download/Mount-Windows-x64.zip"
          download="Mount-Windows-x64.zip"
          className="vortex-btn-primary h-12 px-6 text-[13px] flex items-center gap-2"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>DOWNLOAD FOR WINDOWS (.ZIP)</span>
        </a>

        {/* Tray popover link */}
        <Link
          href="/app"
          className="font-mono text-[12px] text-[#A1A1AA] hover:text-[#FFFFFF] px-4 py-3 transition-colors bg-[#18181B] border border-[#27272A] rounded-[2px] hover:border-[#3F3F46]"
        >
          <span>[ TRAY_POPOVER_MODE ]</span>
          <span className="ml-1 text-[#00AFFF]">↗</span>
        </Link>
      </div>

      {/* Engineering Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
        <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-[2px] hover:border-[#00AFFF]/40 transition-colors">
          <p className="label-md text-[#71717A]">// LATENCY</p>
          <p className="text-[20px] font-semibold text-[#FFFFFF] mt-1 font-mono">&lt;10MS</p>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5 font-mono">Native low-level hook</p>
        </div>

        <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-[2px] hover:border-[#00AFFF]/40 transition-colors">
          <p className="label-md text-[#71717A]">// SWITCH PACKS</p>
          <p className="text-[20px] font-semibold text-[#00AFFF] mt-1 font-mono">13 PROFILES</p>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5 font-mono">Press &amp; release audio</p>
        </div>

        <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-[2px] hover:border-[#00AFFF]/40 transition-colors">
          <p className="label-md text-[#71717A]">// SPATIAL AUDIO</p>
          <p className="text-[20px] font-semibold text-[#FFFFFF] mt-1 font-mono">STEREO</p>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5 font-mono">Physical key coords</p>
        </div>

        <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-[2px] hover:border-[#00AFFF]/40 transition-colors">
          <p className="label-md text-[#71717A]">// ZERO FRICTION</p>
          <p className="text-[20px] font-semibold text-[#FFFFFF] mt-1 font-mono">100% OFFLINE</p>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5 font-mono">Zero telemetry</p>
        </div>
      </div>
    </section>
  );
}


