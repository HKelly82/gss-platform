'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

interface RevealAnswerProps {
  revealLabel?: string;
  hint?: string;
  panelEyebrow?: string;
  onReveal?: () => void;
  children: ReactNode;
}

export function RevealAnswer({
  revealLabel = 'Reveal model answer',
  hint = 'Try your own answer first.',
  panelEyebrow = 'Model answer',
  onReveal,
  children,
}: RevealAnswerProps) {
  const [revealed, setRevealed] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealed && panelRef.current) {
      panelRef.current.focus();
    }
  }, [revealed]);

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    onReveal?.();
  };

  if (!revealed) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-card border border-line bg-white p-6">
        <button
          type="button"
          onClick={handleReveal}
          aria-expanded={false}
          aria-controls={panelId}
          className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
        >
          <span aria-hidden="true">◐</span> {revealLabel}
        </button>
        <p className="text-body text-ink-2">{hint}</p>
      </div>
    );
  }

  return (
    <div
      id={panelId}
      ref={panelRef}
      tabIndex={-1}
      role="region"
      aria-label={panelEyebrow}
      className="rounded-card border-[1.5px] border-ready bg-ready-bg p-6 focus-visible:outline-none"
    >
      <p className="text-eyebrow text-ready">
        <span aria-hidden="true">✓ </span>
        {panelEyebrow}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
