import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  source: string;
  variant?: 'reading' | 'reading-reference' | 'reading-section-body' | 'notes' | 'scenario-dark';
}

function readingComponents(): Components {
  return {
    p: ({ children }) => (
      <p className="mt-4 font-serif text-reading text-ink first:mt-0">{children}</p>
    ),
    h1: ({ children }) => (
      <h2 className="mt-8 text-h2 font-bold text-navy first:mt-0">{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 text-h2 font-bold text-navy">{children}</h2>
    ),
    h3: ({ children }) => (
      <h2 className="mt-8 text-h2 font-bold text-navy">{children}</h2>
    ),
    h4: ({ children }) => (
      <h3 className="mt-6 text-h3 font-semibold text-navy">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-4 border-yellow bg-white px-4 py-3 font-serif text-reading text-ink">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 font-serif text-reading text-ink">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6 font-serif text-reading text-ink">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-bold text-navy">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr className="my-6 border-line" />,
    a: ({ href, children }) => (
      <a href={href} className="text-navy underline decoration-yellow decoration-2 underline-offset-2">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded-sm bg-grey px-1 py-0.5 font-mono text-mono-meta text-ink">
        {children}
      </code>
    ),
    table: ({ children }) => (
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border border-line text-body">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-grey">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-line">{children}</tr>,
    th: ({ children }) => (
      <th className="border-r border-line px-3 py-2 text-left align-top font-sans font-semibold text-navy last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-r border-line px-3 py-2 align-top font-serif text-body text-ink last:border-r-0">
        {children}
      </td>
    ),
  };
}

function notesComponents(): Components {
  return {
    ...readingComponents(),
    p: ({ children }) => <p className="mt-3 text-body text-ink-2 first:mt-0">{children}</p>,
    h3: ({ children }) => (
      <h3 className="mt-6 text-eyebrow uppercase tracking-[0.08em] text-yellow-deep">
        {children}
      </h3>
    ),
    ul: ({ children }) => <ul className="mt-3 list-disc space-y-2 pl-6 text-body text-ink-2">{children}</ul>,
  };
}

function readingReferenceComponents(): Components {
  // Preserves the H2 → <h2>, H3 → <h3> hierarchy that reference-card content
  // authors. The default `reading` variant promotes ### → <h2> to bridge guided
  // content where bodies start at H3 under the page H1; reference cards already
  // use H2 / H3 correctly, so promotion would flatten the structure
  // (WCAG SC 1.3.1 hierarchy skip).
  return {
    ...readingComponents(),
    h1: ({ children }) => (
      <h2 className="mt-8 text-h2 font-bold text-navy first:mt-0">{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 text-h2 font-bold text-navy">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-h3 font-semibold text-navy">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 font-sans text-body font-semibold text-navy">{children}</h4>
    ),
  };
}

function readingSectionBodyComponents(): Components {
  // Demotes body markdown headings by one level. Use this when the renderer's
  // own JSX already supplies a section H2 — body `##` then nests as `<h3>`
  // rather than reading as a sibling H2. Preserves H1 → H3 / H2 → H3 /
  // H3 → H4 / H4 → H5 mappings.
  return {
    ...readingComponents(),
    h1: ({ children }) => (
      <h3 className="mt-6 text-h3 font-semibold text-navy first:mt-0">{children}</h3>
    ),
    h2: ({ children }) => (
      <h3 className="mt-6 text-h3 font-semibold text-navy">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="mt-4 font-sans text-body font-semibold text-navy">{children}</h4>
    ),
    h4: ({ children }) => (
      <h5 className="mt-4 font-sans text-body font-semibold text-navy">{children}</h5>
    ),
  };
}

function scenarioDarkComponents(): Components {
  return {
    p: ({ children }) => (
      <p className="mt-4 font-serif text-reading text-white/85 first:mt-0">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-4 border-yellow px-4 py-3 font-serif text-lede text-white">
        {children}
      </blockquote>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-eyebrow uppercase tracking-[0.08em] text-yellow">{children}</h3>
    ),
  };
}

export function Markdown({ source, variant = 'reading' }: MarkdownProps) {
  const components =
    variant === 'notes'
      ? notesComponents()
      : variant === 'scenario-dark'
        ? scenarioDarkComponents()
        : variant === 'reading-reference'
          ? readingReferenceComponents()
          : variant === 'reading-section-body'
            ? readingSectionBodyComponents()
            : readingComponents();

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {source}
    </ReactMarkdown>
  );
}
