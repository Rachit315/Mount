'use client';

import { useState, useEffect } from 'react';
import { LogoIcon } from './LogoIcon';

const DOWNLOAD_WINDOWS_URL = 'https://github.com/Rachit315/Mount/releases/download/v1.0.0/Mount-Windows-x64.zip';
const DOWNLOAD_MACOS_URL = 'https://github.com/Rachit315/Mount/releases/download/v1.0.0/Mount-macOS-arm64.zip';
const GITHUB_RELEASES_PAGE = 'https://github.com/Rachit315/Mount/releases';
const CLONE_COMMAND = 'git clone https://github.com/Rachit315/Mount.git && cd Mount && npm install && npm run dev';

type Platform = 'windows' | 'macos';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac') || ua.includes('darwin')) return 'macos';
  return 'windows';
}

interface LandingDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LandingDownloadModal({ isOpen, onClose }: LandingDownloadModalProps) {
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<Platform>('windows');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CLONE_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isWin = platform === 'windows';
  const downloadUrl = isWin ? DOWNLOAD_WINDOWS_URL : DOWNLOAD_MACOS_URL;
  const platformLabel = isWin ? 'Windows x64 Portable' : 'macOS (Apple Silicon)';
  const archiveLabel = isWin ? 'Mount-Windows-x64.zip' : 'Mount-macOS-arm64.zip';
  const executableName = isWin ? 'Mount.exe' : 'Mount.app';
  const extractVerb = isWin ? 'Extract the zip archive to any folder on your PC' : 'Extract the zip and drag Mount to your Applications folder';
  const launchVerb = isWin
    ? <>Launch <strong className="text-[#FFFFFF]">Mount.exe</strong> to start global acoustic capture</>
    : <>Open <strong className="text-[#FFFFFF]">Mount.app</strong> and grant Accessibility permission when prompted</>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
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
                v1.0.0 &bull; {platformLabel}
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

        {/* Platform Tabs */}
        <div className="flex gap-1 mb-4">
          <button
            onClick={() => setPlatform('windows')}
            className={`flex-1 py-1.5 text-[11px] font-mono rounded-[2px] border transition-all cursor-pointer ${
              isWin
                ? 'bg-[#00AFFF]/10 border-[#00AFFF]/30 text-[#00AFFF]'
                : 'bg-[#111113] border-[#27272A] text-[#71717A] hover:text-[#A1A1AA]'
            }`}
          >
            ⊞ WINDOWS
          </button>
          <button
            onClick={() => setPlatform('macos')}
            className={`flex-1 py-1.5 text-[11px] font-mono rounded-[2px] border transition-all cursor-pointer ${
              !isWin
                ? 'bg-[#00AFFF]/10 border-[#00AFFF]/30 text-[#00AFFF]'
                : 'bg-[#111113] border-[#27272A] text-[#71717A] hover:text-[#A1A1AA]'
            }`}
          >
             macOS
          </button>
        </div>

        {/* Content */}
        <p className="text-[12px] font-mono text-[#A1A1AA] mb-4 leading-relaxed">
          {isWin
            ? 'Standalone executable bundle with precompiled native Win32 keyboard drivers. 100% offline with zero installation setup.'
            : 'Native macOS menu bar app with Accessibility-based keyboard capture. 100% offline with zero installation setup.'}
        </p>

        {/* 3 Step Setup Guide */}
        <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-4 space-y-2.5 mb-4 text-[12px] font-mono">
          <div className="flex items-start gap-3">
            <span className="text-[#00AFFF] font-bold">01 //</span>
            <p className="text-[#A1A1AA]">
              Download <code className="text-[#FFFFFF] bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-[2px]">{archiveLabel}</code>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#00AFFF] font-bold">02 //</span>
            <p className="text-[#A1A1AA]">
              {extractVerb}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#00AFFF] font-bold">03 //</span>
            <p className="text-[#A1A1AA]">
              {launchVerb}
            </p>
          </div>
        </div>

        {/* Developer Setup Command Box */}
        <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-3 mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-semibold text-[#A1A1AA]">
              // RUN_LOCALLY_FROM_SOURCE:
            </span>
            <button
              onClick={handleCopy}
              className="text-[10px] font-mono text-[#00AFFF] hover:underline cursor-pointer flex items-center gap-1"
            >
              {copied ? '✓ COPIED TO CLIPBOARD' : 'COPY COMMAND'}
            </button>
          </div>
          <pre className="text-[#FFFFFF] bg-[#18181B] p-2.5 rounded-[2px] border border-[#27272A] text-[11px] font-mono overflow-x-auto select-all">
{CLONE_COMMAND}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={downloadUrl}
            className="vortex-btn-primary flex-1 h-10 text-[12px] flex items-center justify-center gap-2"
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
          </a>

          <a
            href={GITHUB_RELEASES_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="vortex-btn-ghost h-10 px-4 text-[12px] flex items-center gap-1.5"
          >
            <span>RELEASES PAGE</span>
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

