interface DotProps {
  state: 'done' | 'current' | 'upcoming';
}

export function Dot({ state }: DotProps) {
  const className =
    state === 'current'
      ? 'h-2.5 w-2.5 rounded-full bg-yellow'
      : state === 'done'
        ? 'h-2 w-2 rounded-full bg-navy'
        : 'h-2 w-2 rounded-full bg-line-2';
  return <span aria-hidden="true" className={className} />;
}
