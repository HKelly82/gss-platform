import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
  module: string;
}

export default function SupplementPage({ params }: { params: Params }) {
  return (
    <PageBody>
      <Placeholder
        title={`Supplement — ${params.module} (${params.pathway.toUpperCase()})`}
        route={`/${params.pathway}/${params.module}/supplement`}
        description="Role supplement from content/output/supplements/M*-S-{PM,BA,DM}.md. Surfaced only when the current pathway has a matching file."
      />
    </PageBody>
  );
}
