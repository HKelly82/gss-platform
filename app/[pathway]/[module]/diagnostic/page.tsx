import { notFound } from 'next/navigation';
import { DiagnosticDecision } from '@/components/DiagnosticDecision';
import { PageBody } from '@/components/PageBody';
import { getDiagnosticForModule, listModuleIds, type Pathway } from '@/lib/content';

const PATHWAY_SLUGS = ['ba', 'dm', 'pm'] as const;
type PathwaySlug = (typeof PATHWAY_SLUGS)[number];

const PATHWAY_BY_SLUG: Record<PathwaySlug, Pathway> = {
  ba: 'BA',
  dm: 'DM',
  pm: 'PM',
};

interface Params {
  pathway: string;
  module: string;
}

export function generateStaticParams(): Array<{ pathway: PathwaySlug; module: string }> {
  return PATHWAY_SLUGS.flatMap((pathway) =>
    listModuleIds().map((module) => ({ pathway, module })),
  );
}

export const dynamicParams = false;

export default function ModuleEntryDiagnosticPage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();
  const pathway = PATHWAY_BY_SLUG[pathwaySlug];
  const moduleId = params.module;
  const diagnostic = getDiagnosticForModule(moduleId);
  if (!diagnostic || diagnostic.options.length === 0) {
    notFound();
  }
  return (
    <PageBody>
      <DiagnosticDecision
        pathway={pathway}
        moduleId={moduleId}
        scenarioMarkdown={diagnostic.scenarioMarkdown}
        options={diagnostic.options}
        notesMarkdown={diagnostic.notesMarkdown}
      />
    </PageBody>
  );
}
