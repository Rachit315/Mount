'use client';

import { LogoIcon } from './LogoIcon';

const GITHUB_RELEASE_DOWNLOAD_URL = 'https://github.com/Rachit315/Mount/releases/latest/download/Mount-Windows-x64.zip';
const GITHUB_RELEASES_PAGE = 'https://github.com/Rachit315/Mount/releases';

interface LandingDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LandingDownloadModal({ isOpen, onClose }: LandingDownloadModalProps) {
  if (!isOpen) return null;

  const triggerDirectDownload = () => {
    if (typeof window !== 'undefined') {
      window.open(GITHUB_RELEASE_DOWNLOAD_URL, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#18181B] border border-[#27272A] rounded-[2px] p-6 sm:p-7 text-left relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <LogoIcon size={28} />
            <div>
              <h3 className="text-[15px] font-mono font-semibold text-[#FFFFFF] tracking-tight">
                // MOUNT_STANDALONE_RELEASE
              </h3>
              <p className="text-[11px] font-mono text-[#00AFFF]">
                v1.0.0 &bull; Windows x64 Portable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-[2px] bg-[#111113] border border-[#27272A] text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-[#3F3F46] flex items-center justify-center cursor-pointer transition-colors font-mono text-xs"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <p className="text-[12px] font-mono text-[#A1A1AA] mb-5 leading-relaxed">
          Standalone executable bundle with precompiled native Win32 keyboard drivers. 100% offline with zero installation required.
        </p>

        {/* 3 Step Setup Guide */}
        <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-4 space-y-3 mb-5 text-[12px] font-mono">
          <div className="flex items-start gap-3">
            <span className="text-[#00AFFF] font-bold">01 //</span>
            <p className="text-[#A1A1AA]">
              Download and extract <code className="text-[#FFFFFF] bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-[2px]">Mount-Windows-x64.zip</code>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#00AFFF] font-bold">02 //</span>
            <p className="text-[#A1A1AA]">
              Double-click <strong className="text-[#FFFFFF]">Mount.exe</strong> to start global acoustic capture
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#00AFFF] font-bold">03 //</span>
            <p className="text-[#A1A1AA]">
              Press <kbd className="text-[#00AFFF] bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-[2px]">Ctrl+Shift+K</kbd> or click the system tray icon to open controls
            </p>
          </div>
        </div>

        {/* Developer Setup Note */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-[2px] p-3 mb-6 text-[11px] font-mono text-[#71717A]">
          <span className="text-[#A1A1AA] font-semibold">// DEVELOPER_LOCAL_BUILD:</span>
          <pre className="mt-1 text-[#00AFFF] bg-[#111113] p-2 rounded-[2px] overflow-x-auto text-[10px]">
git clone https://github.com/Rachit315/Mount.git && cd Mount && npm install && npm run dev
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={triggerDirectDownload}
            className="vortex-btn-primary flex-1 h-10 text-[12px]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>DOWNLOAD .ZIP</span>
          </button>

          <a
            href={GITHUB_RELEASES_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="vortex-btn-ghost h-10 px-4 text-[12px] flex items-center gap-1.5"
          >
            <span>GITHUB RELEASES</span>
            <span className="text-[#00AFFF]">↗</span>
          </a>

          <button
            onClick={onClose}
            className="vortex-btn-ghost h-10 px-3 text-[12px]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
