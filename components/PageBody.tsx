interface PageBodyProps {
  children: React.ReactNode;
  width?: 'hub' | 'prose';
}

export function PageBody({ children, width = 'hub' }: PageBodyProps) {
  const widthClass = width === 'prose' ? 'max-w-prose' : 'max-w-hub';
  return <div className={`mx-auto ${widthClass} px-6 py-8`}>{children}</div>;
}
