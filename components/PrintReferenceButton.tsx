'use client';

import { useEffect } from 'react';
import type { Pathway } from '@/lib/content';
import { markReferenceViewed, setPathway } from '@/lib/progress';

interface PrintReferenceButtonProps {
  pathway: Pathway;
  moduleId: string;
}

export function PrintReferenceButton({ pathway, moduleId }: PrintReferenceButtonProps) {
  useEffect(() => {
    setPathway(pathway);
    markReferenceViewed(pathway, moduleId);
  }, [pathway, moduleId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white transition hover:bg-navy-deep motion-reduce:transition-none"
    >
      Download PDF <span aria-hidden="true">↓</span>
    </button>
  );
}
