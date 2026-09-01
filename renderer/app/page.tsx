'use client';

import { useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { SoundSessionProvider } from '@/lib/sound-session';
import { AmbientBackground } from '@/components/AmbientBackground';
import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingHero } from '@/components/LandingHero';
import { LandingSandbox } from '@/components/LandingSandbox';
import { LandingSwitches } from '@/components/LandingSwitches';
import { LandingFeatures } from '@/components/LandingFeatures';
import { LandingCTA } from '@/components/LandingCTA';
import { LandingDownloadModal } from '@/components/LandingDownloadModal';
import { LandingFooter } from '@/components/LandingFooter';

export default function LandingPage() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const openDownload = () => setDownloadModalOpen(true);

  return (
    <SoundSessionProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-bg text-content">
        {/* Reading progress */}
        <motion.div
          className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left"
          style={{ scaleX: progress, backgroundColor: 'var(--accent)' }}
        />

        <AmbientBackground />

        <LandingNavbar onOpenDownload={openDownload} />
        <LandingHero onOpenDownload={openDownload} />
        <LandingSandbox />
        <LandingSwitches />
        <LandingFeatures />
        <LandingCTA onOpenDownload={openDownload} />

        <LandingDownloadModal
          isOpen={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
        />

        <LandingFooter />
      </div>
    </SoundSessionProvider>
  );
}
