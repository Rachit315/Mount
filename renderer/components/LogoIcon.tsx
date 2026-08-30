'use client';

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 28, className = '' }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#mount-logo-clip)">
        <rect width="100" height="100" rx="12" fill="#59CBFF" />
        <g filter="url(#mount-logo-filter)">
          <path
            d="M2.99989 1.50006L104.5 95.0001L96.5 105L-1.00023 11.0002L2.99989 1.50006Z"
            fill="white"
            fillOpacity="0.8"
          />
        </g>
      </g>
      <rect
        x="8.5"
        y="6.5"
        width="83"
        height="83"
        rx="11.5"
        fill="#00AFFF"
        stroke="#6BD0FF"
        strokeWidth="2"
      />
      <path
        d="M46.546 55.092L44.474 21.2H56.61L54.538 55.092H46.546ZM44.4 67.376C44.4 63.898 47.212 61.16 50.542 61.16C53.872 61.16 56.684 63.898 56.684 67.376C56.684 70.706 54.02 73.444 50.542 73.444C47.064 73.444 44.4 70.706 44.4 67.376Z"
        fill="url(#mount-logo-paint)"
      />
      <defs>
        <filter
          id="mount-logo-filter"
          x="-21"
          y="-18.5"
          width="145.5"
          height="143.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur" />
        </filter>
        <linearGradient
          id="mount-logo-paint"
          x1="51"
          y1="21.5"
          x2="50"
          y2="74.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.264745" stopColor="white" />
          <stop offset="1" stopColor="#EBEBEB" />
        </linearGradient>
        <clipPath id="mount-logo-clip">
          <rect width="100" height="100" rx="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
