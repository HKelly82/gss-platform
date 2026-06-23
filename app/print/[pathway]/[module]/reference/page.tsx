import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
  module: string;
}

export default function PrintReferenceCardPage({ params }: { params: Params }) {
  return (
    <PageBody>
      <Placeholder
        title={`Print reference card — ${params.module}`}
        route={`/print/${params.pathway}/${params.module}/reference`}
        description="No-chrome print view. The PDF mechanism (window.print() vs. @react-pdf/renderer) is decision D-6."
      />
    </PageBody>
  );
}
