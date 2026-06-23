import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

interface Params {
  pathway: string;
  module: string;
  tier: string;
}

export default function TierOverviewPage({ params }: { params: Params }) {
  return (
    <PageBody>
      <Placeholder
        title={`Tier overview — ${params.module} ${params.tier}`}
        route={`/${params.pathway}/${params.module}/${params.tier}`}
        description="TierPreface (the inline blockquote from the tier file) + Skip-tier and Begin-tier affordances. No separate /diagnostic route at tier level — the preface absorbs the diagnostic role."
      />
    </PageBody>
  );
}
