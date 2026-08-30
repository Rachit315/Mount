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

          {/* GitHub Icon Link on extreme right */}
          <a
            href="https://github.com/Rachit315/Mount"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="w-9 h-9 flex items-center justify-center rounded-[2px] bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-[#3F3F46] hover:bg-[#27272A]/50 transition-all cursor-pointer"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

