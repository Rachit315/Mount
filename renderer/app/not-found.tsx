'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-6 text-center text-content">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-6 flex justify-center gap-2">
          {['4', '0', '4'].map((c, i) => (
            <motion.span
              key={i}
              className="keycap items-center justify-center"
              style={{
                width: 58,
                height: 58,
                fontSize: 24,
                fontWeight: 700,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.16,
                ease: 'easeInOut',
              }}
            >
              {c}
            </motion.span>
          ))}
        </div>

        <h1 className="mb-2 text-[24px] font-semibold tracking-[-0.025em]">
          Nothing mapped to this key
        </h1>
        <p className="body-md mb-7">
          That page doesn&apos;t exist — or it moved somewhere else.
        </p>

        <Link href="/" className="btn btn-primary">
          Back to Mount
        </Link>
      </motion.div>
    </div>
  );
}
