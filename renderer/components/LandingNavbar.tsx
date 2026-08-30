'use client';

import Link from 'next/link';
import { LogoIcon } from './LogoIcon';

interface LandingNavbarProps {
  onOpenDownload: () => void;
}

export function LandingNavbar({ onOpenDownload }: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-lg border-b border-[#27272A] transition-all">
      <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Telemetry */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex-shrink-0 transition-transform group-hover:scale-105">
            <LogoIcon size={30} />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px] text-[#FFFFFF] tracking-tight">
              Mount
            </span>
            <span className="text-[10px] font-mono text-[#00AFFF] px-1.5 py-0.5 rounded-[2px] bg-[#00AFFF]/10 border border-[#00AFFF]/20">
              VORTEX // CORE
            </span>
          </div>
        </Link>

        {/* Technical Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[12px] text-[#A1A1AA]">
          <a href="#sandbox" className="hover:text-[#00AFFF] transition-colors">
            // SOUND_ENGINE
          </a>
          <a href="#switches" className="hover:text-[#00AFFF] transition-colors">
            // SWITCH_PACKS
          </a>
          <a href="#features" className="hover:text-[#00AFFF] transition-colors">
            // ARCHITECTURE
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="hidden sm:inline-flex items-center font-mono text-[12px] text-[#A1A1AA] hover:text-[#FFFFFF] px-3 py-1.5 rounded-[2px] bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] transition-all"
          >
            <span>[ TRAY_POPOVER ]</span>
            <span className="ml-1 text-[#00AFFF]">↗</span>
          </Link>

          <button
            onClick={onOpenDownload}
            className="vortex-btn-primary h-9 text-[12px] px-4"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>DOWNLOAD .ZIP</span>
          </button>
        </div>
      </div>
    </header>
  );
}
