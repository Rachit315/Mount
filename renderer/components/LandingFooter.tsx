'use client';

import Link from 'next/link';
import { LogoIcon } from './LogoIcon';

export function LandingFooter() {
  return (
    <footer className="bg-[#000000] border-t border-[#27272A] py-12 px-6 text-[12px] font-mono text-[#A1A1AA] relative z-10">
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <LogoIcon size={24} />
          <div>
            <span className="font-semibold text-[#FFFFFF]">Mount</span>
            <span className="mx-2 text-[#52525B]">//</span>
            <span>VORTEX ACOUSTIC SYSTEM &bull; 13 HARDWARE SWITCH PACKS</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[#A1A1AA] font-mono text-[12px]">
          <Link href="/app" className="hover:text-[#00AFFF] transition-colors">
            // TRAY_POPOVER
          </Link>
          <a href="#sandbox" className="hover:text-[#00AFFF] transition-colors">
            // SANDBOX
          </a>
          <a href="#switches" className="hover:text-[#00AFFF] transition-colors">
            // SWITCH_PROFILES
          </a>
          <a href="#features" className="hover:text-[#00AFFF] transition-colors">
            // ARCHITECTURE
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-[#00AFFF]" />
          <span className="text-[#00AFFF]">// OFFLINE_CORE_ACTIVE</span>
        </div>
      </div>
    </footer>
  );
}
