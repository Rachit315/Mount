'use client';

import { LogoIcon } from './LogoIcon';

interface HeaderProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function Header({ enabled, onToggle }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 h-14 bg-[#18181B] border-b border-[#27272A]">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <LogoIcon size={24} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-mono font-semibold text-[#FFFFFF] tracking-tight">
              Mount
            </span>
            <span className="text-[9px] font-mono text-[#00AFFF] px-1.5 py-0.2 rounded-[2px] bg-[#00AFFF]/10 border border-[#00AFFF]/20">
              VORTEX
            </span>
          </div>
          <p className="text-[10px] font-mono text-[#71717A] leading-none mt-0.5">
            {enabled ? '// AUDIO_ENGINE_ACTIVE' : '// SYSTEM_MUTED'}
          </p>
        </div>
      </div>

      {/* Recessed Toggle Switch */}
      <div className="flex items-center gap-2.5">
        <span
          className="w-2 h-2 rounded-full transition-colors duration-150"
          style={{ backgroundColor: enabled ? '#00AFFF' : '#52525B' }}
        />
        <button
          onClick={() => onToggle(!enabled)}
          aria-label={enabled ? 'Disable audio engine' : 'Enable audio engine'}
          className="relative w-9 h-5 rounded-full transition-colors duration-150 focus-visible:outline-none cursor-pointer border"
          style={{
            backgroundColor: enabled ? '#00AFFF' : '#27272A',
            borderColor: enabled ? '#00AFFF' : '#3F3F46',
            boxShadow: enabled ? '0 0 10px rgba(0, 175, 255, 0.4)' : 'none',
          }}
        >
          <div
            className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-transform duration-150"
            style={{
              backgroundColor: enabled ? '#000000' : '#A1A1AA',
              transform: enabled ? 'translateX(18px)' : 'translateX(2px)',
            }}
          />
        </button>
      </div>
    </div>
  );
}
