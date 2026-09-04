import Link from 'next/link';
import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { getAdminClient } from '@/lib/services/client';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { mapCard } from '@/src/features/creative-marketing-showcase/api/projects';
import { creativeServiceGroupLabel } from '@/src/features/creative-marketing-showcase/config/constants';
import type { CreativeMarketingProjectCard } from '@/src/features/creative-marketing-showcase/types';

export const metadata = buildPageMetadata({
  title: 'Creative & Digital Marketing',
  path: ROUTES.adminCreativeMarketingProjects,
  noIndex: true,
});

async function listAdminProjects(): Promise<CreativeMarketingProjectCard[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('creative_marketing_project_cards')
    .select(
      'id, title, slug, short_description, outcome_line, service_group, service_type, service_subcategory, target_business, pricing_model, cover_card_url, cover_detail_url, starting_price, price_suffix, currency, featured, popular, published, sort_order, created_at, updated_at, deleted_at, asset_count'
    )
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[admin/creative-marketing]', error.message);
    return [];
  }
  return (data ?? []).map((row) => mapCard(row as Record<string, unknown>));
}

export default async function AdminCreativeMarketingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(ROUTES.adminCreativeMarketingProjects)}`);
  if (!isShowcaseViewerRole(profile.role)) redirect('/unauthorized');

  const projects = await listAdminProjects();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Products &amp; Services
          </p>
          <h1 className="font-display text-2xl font-black text-text-primary">
            Creative &amp; Digital Marketing
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {projects.length} service{projects.length === 1 ? '' : 's'} (including drafts)
          </p>
        </div>
        <Link href={ROUTES.admin} className="text-sm font-semibold text-[#2563eb] hover:underline">
          ← Admin home
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-background-soft text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Group</th>
              <th className="px-4 py-3 font-semibold">Pricing</th>
              <th className="px-4 py-3 font-semibold">Published</th>
              <th className="px-4 py-3 font-semibold">Assets</th>
              <th className="px-4 py-3 font-semibold">Edit</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-text-secondary">
                  No services yet. Run <code className="text-xs">npm run seed:creative-marketing</code>.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-3 font-medium">
                    <div>{project.title}</div>
                    <div className="text-xs text-text-muted">{project.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {creativeServiceGroupLabel(project.service_group)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{project.pricing_model}</td>
                  <td className="px-4 py-3">
                    {project.published ? (
                      <span className="text-emerald-700">Yes</span>
                    ) : (
                      <span className="text-amber-700">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{project.asset_count}</td>
                  <td className="px-4 py-3 text-text-muted">Soon</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
