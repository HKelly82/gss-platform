import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
}

export default function PathwayHomePage({ params }: { params: Params }) {
  return (
    <PageBody>
      <Placeholder
        title={`Pathway home — ${params.pathway.toUpperCase()}`}
        route={`/${params.pathway}`}
        description="Eight-module list with status. Sidebar appears here on hub pages."
      />
    </PageBody>
  );
}
