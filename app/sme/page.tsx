import { PageBody } from '@/components/PageBody';
import { Placeholder } from '@/components/Placeholder';

export default function SMEHomePage() {
  return (
    <PageBody>
      <Placeholder
        title="SME pathway"
        route="/sme"
        description="SME pathway home. Renders once SME-meta content lands; until then this is a placeholder per the accepted content-gap constraint."
      />
    </PageBody>
  );
}
