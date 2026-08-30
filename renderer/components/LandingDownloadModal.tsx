'use client';

import { useState } from 'react';
import { LogoIcon } from './LogoIcon';

const GITHUB_RELEASES_PAGE = 'https://github.com/Rachit315/Mount/releases';
const CLONE_COMMAND = 'git clone https://github.com/Rachit315/Mount.git && cd Mount && npm install && npm run dev';

interface LandingDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LandingDownloadModal({ isOpen, onClose }: LandingDownloadModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CLONE_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <p className="text-[12px] font-mono text-[#A1A1AA] mb-4 leading-relaxed">
          Standalone executable bundle with precompiled native Win32 keyboard drivers. 100% offline with zero installation required.
        </p>

        {/* 3 Step Setup Guide */}
        <div className="bg-[#111113] border border-[#27272A] rounded-[2px] p-4 space-y-2.5 mb-4 text-[12px] font-mono">
          <div className="flex items-start gap-3">
            <span className="text-[#00AFFF] font-bold">01 //</span>
            <p className="text-[#A1A1AA]">
              Download and extract <code className="text-[#FFFFFF] bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-[2px]">Mount-Windows-x64.zip</code> from GitHub Releases
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
              Press <kbd className="text-[#00AFFF] bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-[2px]">Ctrl+Shift+K</kbd> to toggle controls
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
            href={GITHUB_RELEASES_PAGE}
            target="_blank"
            rel="noopener noreferrer"
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
            <span>GITHUB RELEASES PAGE</span>
          </a>

          <button
            onClick={onClose}
            className="vortex-btn-ghost h-10 px-4 text-[12px]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
