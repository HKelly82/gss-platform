import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
  module: string;
}

export default function ModuleHubPage({ params }: { params: Params }) {
  return (
    <PageBody>
      <Placeholder
        title={`Module hub — ${params.module}`}
        route={`/${params.pathway}/${params.module}`}
        description="Sidebar (312px module nav) + four TierCards with the current expanded into ComponentRows."
      />
    </PageBody>
  );
}
