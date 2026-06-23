import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
  module: string;
}

export default function ReferenceCardPage({ params }: { params: Params }) {
  return (
    <PageBody>
      <Placeholder
        title={`Reference card — ${params.module}`}
        route={`/${params.pathway}/${params.module}/reference`}
        description="On-screen reference card with print stylesheet. PDF mechanism is the D-6 decision."
      />
    </PageBody>
  );
}
