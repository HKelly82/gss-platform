import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

export default function HomePage() {
  return (
    <PageBody>
      <Placeholder
        title="Pathway selection"
        route="/"
        description="PathwayCard grid (BA / DM / PM / SME) plus the Layer 0 primer banner. Copy is currently a STUB sourced from DESIGN-SPEC.md; the source flips to content/output/pathways/PATH-*.md when those files land."
      />
    </PageBody>
  );
}
