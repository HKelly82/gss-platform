import { notFound } from 'next/navigation';
import { PageBody } from '@/components/PageBody';
import { SMEMetaModule } from '@/components/SMEMetaModule';
import {
  assertContentLoaded,
  getSMEMetaMeta,
  getSMESection,
  listSMEMetaModules,
  type ParsedSMESection,
  type SMEMeta,
  type SMESectionKey,
} from '@/lib/content';

const META_KEYS: SMEMeta[] = ['S1', 'S2', 'S3'];

interface Params {
  meta: string;
}

export function generateStaticParams(): Array<{ meta: SMEMeta }> {
  assertContentLoaded();
  return listSMEMetaModules().map((meta) => ({ meta }));
}

export const dynamicParams = false;

export default function SMEMetaModulePage({ params }: { params: Params }) {
  const meta = params.meta as SMEMeta;
  if (!META_KEYS.includes(meta)) notFound();

  const metaMeta = getSMEMetaMeta(meta);
  if (!metaMeta) notFound();

  const sections: Array<{ key: SMESectionKey; parsed: ParsedSMESection }> = [];
  for (const key of metaMeta.sections) {
    const parsed = getSMESection(meta, key);
    if (parsed) sections.push({ key, parsed });
  }
  if (sections.length === 0) notFound();

  return (
    <PageBody width="prose">
      <SMEMetaModule meta={meta} metaMeta={metaMeta} sections={sections} />
    </PageBody>
  );
}
