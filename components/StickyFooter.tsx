import Link from 'next/link';
import { Dot } from './Dot';

interface StickyFooterProps {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
  stepCount: number;
  currentStep: number;
}

export function StickyFooter({ prev, next, stepCount, currentStep }: StickyFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-12 border-t border-line bg-white">
      <nav
        aria-label="Tier step navigation"
        className="mx-auto flex max-w-prose items-center justify-between px-6 py-4"
      >
        {prev ? (
          <Link
            href={prev.href}
            className="inline-flex items-center gap-2 rounded-control border-[1.5px] border-navy bg-white px-4 py-2 font-sans text-body font-semibold text-navy transition hover:bg-navy hover:text-white motion-reduce:transition-none"
          >
            <span aria-hidden="true">←</span> {prev.label}
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}

        <ol
          aria-label={`Component ${currentStep} of ${stepCount}`}
          className="flex items-center gap-2"
        >
          {Array.from({ length: stepCount }, (_, i) => {
            const idx = i + 1;
            const state: 'done' | 'current' | 'upcoming' =
              idx < currentStep ? 'done' : idx === currentStep ? 'current' : 'upcoming';
            return (
              <li key={idx}>
                <Dot state={state} />
                <span className="sr-only">
                  Step {idx}
                  {state === 'current' ? ' (current)' : state === 'done' ? ' (complete)' : ''}
                </span>
              </li>
            );
          })}
        </ol>

        {next ? (
          <Link
            href={next.href}
            className="inline-flex items-center gap-2 rounded-control bg-navy px-4 py-2 font-sans text-body font-semibold text-white transition hover:bg-navy-deep motion-reduce:transition-none"
          >
            {next.label} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>
    </div>
  );
}
