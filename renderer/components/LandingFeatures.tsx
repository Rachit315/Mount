'use client';

const features = [
  {
    code: '01 // HOOK',
    title: 'Sub-10ms Win32 Keyboard Hook',
    description:
      'Low-level Windows event hooks through uiohook-napi capture keystrokes system-wide with zero perceptible input lag.',
    badge: 'WIN32_HOOK',
  },
  {
    code: '02 // SPATIAL',
    title: 'Stereo Coordinate Panning',
    description:
      'Every key is mapped to physical coordinate offsets across StereoPannerNode (-0.7 to +0.7) for directional realism.',
    badge: 'SPATIAL_PAN',
  },
  {
    code: '03 // PRIVACY',
    title: '100% Offline & Zero Telemetry',
    description:
      'No background analytics, no cloud connections, and no user accounts. Your keystrokes never leave your local machine.',
    badge: 'OFFLINE_CORE',
  },
  {
    code: '04 // DSP',
    title: '2D Tone & Pitch Calibration',
    description:
      'Interactive 2D pad allows fine-tuning filter cutoff (Thock ↔ Clack) and sample pitch playback rate in real time.',
    badge: 'DSP_CALIBRATION',
  },
  {
    code: '05 // DAEMON',
    title: 'System Tray Daemon & Hotkey',
    description:
      'Runs unobtrusively in the Windows notification area. Toggle window visibility instantly with Ctrl+Shift+K.',
    badge: 'TRAY_DAEMON',
  },
  {
    code: '06 // ACOUSTICS',
    title: 'Dual Press & Release Modeling',
    description:
      'High-fidelity recording manifests capturing both keydown downstroke and keyup return release for genuine acoustic feedback.',
    badge: 'DUAL_SAMPLE',
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 px-6 max-w-[1240px] mx-auto relative z-10">
      {/* Section Header */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#00AFFF] mb-2 uppercase">
          <span>[ MODULE // 03 ]</span>
          <span>&bull;</span>
          <span>Core System Architecture</span>
        </div>
        <h3 className="display-md text-[#FFFFFF]">
          Engineered for scale. Controlled by none.
        </h3>
        <p className="body-md text-[#A1A1AA] text-sm mt-1 max-w-xl">
          Engineered for minimal resource footprint, instant responsiveness, and complete user privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-[2px] bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] text-[#71717A]">
                  {f.code}
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#00AFFF] px-2 py-0.5 rounded-[2px] bg-[#00AFFF]/10 border border-[#00AFFF]/20">
                  {f.badge}
                </span>
              </div>
              <h4 className="text-[15px] font-mono font-semibold text-[#FFFFFF] mb-2">
                {f.title}
              </h4>
              <p className="text-[12px] font-mono text-[#A1A1AA] leading-relaxed">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mt-12 bg-[#18181B] border border-[#27272A] rounded-[2px] p-6 sm:p-8 overflow-x-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[15px] font-mono font-semibold text-[#FFFFFF]">
            // SPECIFICATION_COMPARISON_MATRIX
          </h4>
          <span className="text-[11px] font-mono text-[#00AFFF]">
            [ CORE_AUDIT // PASS ]
          </span>
        </div>

        <table className="w-full text-left text-[12px] font-mono min-w-[540px]">
          <thead>
            <tr className="text-[#71717A] uppercase text-[11px] border-b border-[#27272A]">
              <th className="py-3 px-3">Metric</th>
              <th className="py-3 px-3 text-[#00AFFF]">Mount (Vortex Core)</th>
              <th className="py-3 px-3 text-[#71717A]">Other Solutions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A] text-[#A1A1AA]">
            <tr>
              <td className="py-3.5 px-3 text-[#FFFFFF] font-medium">License Model</td>
              <td className="py-3.5 px-3 text-[#00AFFF] font-semibold">MIT Open Source (Free)</td>
              <td className="py-3.5 px-3 text-[#71717A]">Proprietary / Paid</td>
            </tr>
            <tr>
              <td className="py-3.5 px-3 text-[#FFFFFF] font-medium">Network Calls</td>
              <td className="py-3.5 px-3 text-[#00AFFF] font-semibold">Zero Telemetry (100% Offline)</td>
              <td className="py-3.5 px-3 text-[#71717A]">Telemetry &amp; Tracking</td>
            </tr>
            <tr>
              <td className="py-3.5 px-3 text-[#FFFFFF] font-medium">Input Latency</td>
              <td className="py-3.5 px-3 text-[#00AFFF] font-semibold">&lt;10ms (Low-Level Hook)</td>
              <td className="py-3.5 px-3 text-[#71717A]">30ms - 80ms</td>
            </tr>
            <tr>
              <td className="py-3.5 px-3 text-[#FFFFFF] font-medium">Spatial Stereo</td>
              <td className="py-3.5 px-3 text-[#00AFFF] font-semibold">Physical Coordinate Pan Map</td>
              <td className="py-3.5 px-3 text-[#71717A]">Fixed Centered Mono</td>
            </tr>
            <tr>
              <td className="py-3.5 px-3 text-[#FFFFFF] font-medium">Acoustic Engine</td>
              <td className="py-3.5 px-3 text-[#00AFFF] font-semibold">13 Hardware Sample Packs + DSP</td>
              <td className="py-3.5 px-3 text-[#71717A]">Static Uncalibrated Audio</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
