import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  source: string;
  variant?: 'reading' | 'notes' | 'scenario-dark';
}

function readingComponents(): Components {
  return {
    p: ({ children }) => (
      <p className="mt-4 font-serif text-reading text-ink first:mt-0">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="mt-8 text-h1 font-extrabold text-navy first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 text-h2 font-bold text-navy">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-h3 font-semibold text-navy">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-4 border-yellow bg-white px-4 py-3 font-serif text-reading text-ink">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-body text-ink">{children}</ul>,
    ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-body text-ink">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-bold text-navy">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr className="my-6 border-line" />,
    a: ({ href, children }) => (
      <a href={href} className="text-navy underline decoration-yellow decoration-2 underline-offset-2">
        {children}
      </a>
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
        : readingComponents();

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {source}
    </ReactMarkdown>
  );
}
