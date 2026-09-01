'use client';

import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional control or badge pinned to the right on wide screens. */
  trailing?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  trailing,
}: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className="h-px w-7"
            style={{ backgroundColor: 'var(--accent)' }}
          />
          <span
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: 'var(--accent)' }}
          >
            {eyebrow}
          </span>
        </div>

        <h2 className="display-md text-content">{title}</h2>

        {description && (
          <p className="body-md mt-3 max-w-xl">{description}</p>
        )}
      </div>

      {trailing && <div className="flex-shrink-0">{trailing}</div>}
    </Reveal>
  );
}
