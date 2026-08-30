'use client';

interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export function VolumeControl({ volume, onChange }: VolumeControlProps) {
  return (
    <div className="px-5 py-2.5">
      <div className="flex items-center justify-between mb-2">
        <span className="label-md text-[#A1A1AA]">
          // MASTER_GAIN
        </span>
        <span className="text-[11px] text-[#00AFFF] font-semibold tabular-nums font-mono">
          {Math.round(volume * 100)}%
        </span>
      </div>

      <div className="relative h-6 flex items-center group">
        {/* Recessed Track */}
        <div className="absolute inset-x-0 h-2 rounded-[2px] overflow-hidden bg-[#111113] border border-[#27272A]">
          <div
            className="h-full bg-[#00AFFF] transition-all duration-75"
            style={{ width: `${volume * 100}%` }}
          />
        </div>

        {/* Input */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Volume"
        />

        {/* Thumb */}
        <div
          className="absolute w-3.5 h-3.5 rounded-[2px] bg-[#00AFFF] pointer-events-none transition-transform shadow-[0_0_8px_rgba(0,175,255,0.7)]"
          style={{
            left: `calc(${volume * 100}% - 7px)`,
          }}
        />
      </div>
    </div>
  );
}
