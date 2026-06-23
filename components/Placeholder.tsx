interface PlaceholderProps {
  title: string;
  route: string;
  description?: string;
}

export function Placeholder({ title, route, description }: PlaceholderProps) {
  return (
    <section className="mx-auto max-w-prose py-12">
      <p className="text-eyebrow text-yellow-deep">Scaffold placeholder</p>
      <h1 className="mt-2 text-h1 font-extrabold text-navy">{title}</h1>
      <p className="mt-2 font-mono text-mono-meta text-ink-3">{route}</p>
      {description ? (
        <p className="mt-6 font-serif text-reading text-ink">{description}</p>
      ) : null}
      <p className="mt-8 text-body text-ink-2">
        Renderers for this route will be built by <code className="font-mono">/build-component</code>.
      </p>
    </section>
  );
}
