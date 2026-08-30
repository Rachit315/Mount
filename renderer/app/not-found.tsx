'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-sm text-[#8f8f8f] mb-6">Could not find requested resource</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#0072F5] text-white text-xs font-semibold rounded-[6px] hover:bg-[#005bb5] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
