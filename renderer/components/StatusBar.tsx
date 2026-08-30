'use client';

interface StatusBarProps {
  profileName: string;
  keystrokeCount: number;
  enabled: boolean;
}

export function StatusBar({ profileName, keystrokeCount, enabled }: StatusBarProps) {
  return (
    <div className="px-5 py-3 mt-auto bg-[#18181B] border-t border-[#27272A]">
      <div className="flex items-center justify-between">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: enabled ? '#00AFFF' : '#52525B' }}
          />
          <span className="text-[11px] font-mono font-semibold text-[#FFFFFF] truncate max-w-[130px]">
            {enabled ? profileName : 'MUTED'}
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#111113] text-[#00AFFF] border border-[#27272A]">
            &lt;10MS
          </span>
        </div>

        {/* Keystrokes & Hotkey */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#A1A1AA] font-mono tabular-nums">
            {keystrokeCount.toLocaleString()} KEYS
          </span>
          <kbd className="text-[9px] font-mono text-[#00AFFF] bg-[#111113] border border-[#27272A] px-1.5 py-0.5 rounded-[2px]">
            Ctrl+Shift+K
          </kbd>
        </div>
      </div>
    </div>
  );
}
