import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
  module: string;
}

export default function ModuleEntryDiagnosticPage({ params }: { params: Params }) {
  return (
    <Placeholder
      title={`Module-entry diagnostic — ${params.module}`}
      route={`/${params.pathway}/${params.module}/diagnostic`}
      description="Four-option placement diagnostic from M*-entry.md. Selecting an option records placement in lib/progress and routes to the landing tier."
    />
  );
}
