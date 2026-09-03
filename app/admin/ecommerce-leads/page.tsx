import { requireShowcaseViewer } from '@/src/features/ecommerce-showcase/api/auth';
import { adminListLeads } from '@/src/features/ecommerce-showcase/api/admin';
import { ShowcaseAdminShell } from '@/src/features/ecommerce-showcase/admin/ShowcaseAdminShell';
import { LeadInbox } from '@/src/features/ecommerce-showcase/admin/LeadInbox';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'E-commerce Leads',
  path: '/admin/ecommerce-leads',
  noIndex: true,
});

export default async function EcommerceLeadsPage() {
  const profile = await requireShowcaseViewer();
  const leads = await adminListLeads();
  return (
    <ShowcaseAdminShell profile={profile}>
      <LeadInbox leads={leads} profile={profile} />
    </ShowcaseAdminShell>
  );
}
