import { notFound } from 'next/navigation';
import { PageBody } from '@/components/PageBody';
import { PathwayHome } from '@/components/PathwayHome';
import {
  assertContentLoaded,
  getModuleMeta,
  listModuleIds,
  type ModuleMeta,
  type Pathway,
} from '@/lib/content';

const PATHWAY_SLUGS = ['ba', 'dm', 'pm'] as const;
type PathwaySlug = (typeof PATHWAY_SLUGS)[number];
const PATHWAY_BY_SLUG: Record<PathwaySlug, Pathway> = { ba: 'BA', dm: 'DM', pm: 'PM' };

interface Params {
  pathway: string;
}

export function generateStaticParams(): Array<{ pathway: PathwaySlug }> {
  assertContentLoaded();
  return PATHWAY_SLUGS.map((pathway) => ({ pathway }));
}

export const dynamicParams = false;

export default function PathwayHomePage({ params }: { params: Params }) {
  const pathwaySlug = params.pathway as PathwaySlug;
  if (!PATHWAY_SLUGS.includes(pathwaySlug)) notFound();

  const modules: ModuleMeta[] = listModuleIds()
    .map((id) => getModuleMeta(id))
    .filter((m): m is ModuleMeta => m !== null);

  return (
    <PageBody>
      <PathwayHome
        pathway={PATHWAY_BY_SLUG[pathwaySlug]}
        pathwaySlug={pathwaySlug}
        modules={modules}
      />
    </PageBody>
  );
}
