'use client';

interface LogoIconProps {
  size?: number;
  className?: string;
}

/**
 * A single keycap seen slightly from above — the mark reads at 20px and picks
 * up the theme's accent so it sits inside the palette instead of fighting it.
 */
export function LogoIcon({ size = 28, className = '' }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Case / base */}
      <rect
        x="1"
        y="2"
        width="30"
        height="28"
        rx="7"
        fill="var(--accent)"
      />

      {/* Cap body */}
      <path
        d="M6.4 9.6a3 3 0 0 1 3-3h13.2a3 3 0 0 1 3 3v11.6a3.6 3.6 0 0 1-3.6 3.6H10a3.6 3.6 0 0 1-3.6-3.6V9.6Z"
        fill="var(--cap-alpha)"
      />

      {/* Top surface highlight */}
      <path
        d="M8.9 10.6a2 2 0 0 1 2-2h10.2a2 2 0 0 1 2 2v6.2a2.4 2.4 0 0 1-2.4 2.4h-9.4a2.4 2.4 0 0 1-2.4-2.4v-6.2Z"
        fill="var(--cap-alpha-top)"
      />

      {/* Legend — the "M" stem */}
      <path
        d="M12.4 17.4V11.9h1.9l2 3.1 2-3.1h1.9v5.5h-1.6v-3l-1.6 2.5h-1.4l-1.6-2.5v3h-1.6Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
