'use client';

import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { RevealGroup, RevealItem } from './Reveal';

const features = [
  {
    n: '01',
    title: 'A native hook, not a web listener',
    description:
      'Mount taps the OS input layer through uiohook-napi, so the sound lands with your keypress instead of trailing behind it.',
    icon: BoltIcon,
  },
  {
    n: '02',
    title: 'Keys sound where they sit',
    description:
      'Every scan code carries a physical coordinate that maps onto a stereo pan between −0.7 and +0.7. Q sits left, P sits right.',
    icon: WavesIcon,
  },
  {
    n: '03',
    title: 'Nothing leaves your machine',
    description:
      'No accounts, no analytics, no network calls of any kind. The keystrokes it hears never travel further than your speakers.',
    icon: ShieldIcon,
  },
  {
    n: '04',
    title: 'Tune the thock',
    description:
      'A two-axis pad moves filter cutoff along one edge and sample pitch along the other, so any pack can be dialled deeper or sharper.',
    icon: SlidersIcon,
  },
  {
    n: '05',
    title: 'Lives in your tray',
    description:
      'It sits in the system tray on Windows and the menu bar on macOS. Ctrl+Shift+K — or ⌘+Shift+K — brings the panel back.',
    icon: WindowIcon,
  },
  {
    n: '06',
    title: 'Press and release, sampled apart',
    description:
      'Each pack records the downstroke and the return separately, which is why holding a key sounds different from tapping it.',
    icon: LayersIcon,
  },
];

const comparison = [
  {
    metric: 'Network calls',
    mount: 'None — fully offline',
    others: 'Telemetry & tracking',
  },
  {
    metric: 'Input latency',
    mount: 'Under 10ms, native hook',
    others: '30–80ms',
  },
  {
    metric: 'Stereo image',
    mount: 'Per-key coordinate panning',
    others: 'Fixed centre mono',
  },
  {
    metric: 'Sound library',
    mount: '13 sampled packs + live DSP',
    others: 'A handful of static clips',
  },
  {
    metric: 'Price',
    mount: 'Free, forever',
    others: 'Paid or ad-supported',
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="relative z-10 mx-auto max-w-shell px-5 py-24 sm:px-6"
    >
      <SectionHeading
        eyebrow="Under the hood"
        title="Small, quiet, and quick about it"
        description="Mount is built to be the least demanding thing running on your machine while still sounding like the most expensive one."
      />

      <RevealGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <RevealItem key={f.n}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="card card-hover h-full p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    color: 'var(--accent)',
                  }}
                >
                  <f.icon />
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-content-3">
                  {f.n}
                </span>
              </div>

              <h3 className="mb-2 text-[16px] font-semibold tracking-[-0.02em] text-content">
                {f.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-content-2">
                {f.description}
              </p>
            </motion.div>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Comparison */}
      <RevealItem>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="card mt-14 overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-content">
              How it compares
            </h3>
            <span className="badge badge-accent">Measured on Windows 11</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-line text-content-3">
                  <th className="px-6 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em]">
                    Metric
                  </th>
                  <th
                    className="px-6 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: 'var(--accent)' }}
                  >
                    Mount
                  </th>
                  <th className="px-6 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em]">
                    Typical alternative
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <motion.tr
                    key={row.metric}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-content">
                      {row.metric}
                    </td>
                    <td
                      className="px-6 py-4 font-medium"
                      style={{ color: 'var(--accent)' }}
                    >
                      {row.mount}
                    </td>
                    <td className="px-6 py-4 text-content-3">{row.others}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </RevealItem>
    </section>
  );
}

// ── Icons ──────────────────────────────────────────────────────────

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function BoltIcon() {
  return (
    <svg {...iconProps}>
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
    </svg>
  );
}

function WavesIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 12h2M8 6v12M12 3v18M16 7v10M20 11h1" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3 4.5 6v6c0 4.4 3.1 8.3 7.5 9.4 4.4-1.1 7.5-5 7.5-9.4V6L12 3Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 20v-7M4 9V4M12 20v-9M12 7V4M20 20v-5M20 11V4" />
      <path d="M2 13h4M10 7h4M18 15h4" />
    </svg>
  );
}

function WindowIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M6.6 6.5h.01M9.4 6.5h.01" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg {...iconProps}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
    </svg>
  );
}
