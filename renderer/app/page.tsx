'use client';

import { useState } from 'react';
import { VortexBackground } from '@/components/VortexBackground';
import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingHero } from '@/components/LandingHero';
import { LandingSandbox } from '@/components/LandingSandbox';
import { LandingSwitches } from '@/components/LandingSwitches';
import { LandingFeatures } from '@/components/LandingFeatures';
import { LandingDownloadModal } from '@/components/LandingDownloadModal';
import { LandingFooter } from '@/components/LandingFooter';

export default function LandingPage() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] relative overflow-x-hidden selection:bg-[#00AFFF] selection:text-[#000000]">
      {/* Animated Vortex Background Effect */}
      <VortexBackground />

      {/* Navigation */}
      <LandingNavbar onOpenDownload={() => setDownloadModalOpen(true)} />

      {/* Hero Section */}
      <LandingHero
        onOpenDownload={() => setDownloadModalOpen(true)}
      />

      {/* Live Sound Engine Sandbox */}
      <LandingSandbox />

      {/* Switch Profiles Showcase */}
      <LandingSwitches />

      {/* Architecture & Features */}
      <LandingFeatures />

      {/* Direct Download Modal */}
      <LandingDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
