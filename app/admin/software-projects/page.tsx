import Link from 'next/link';
import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { getAdminClient } from '@/lib/services/client';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { mapCard } from '@/src/features/software-showcase/api/projects';
import { solutionGroupLabel } from '@/src/features/software-showcase/config/constants';
import type { SoftwareProjectCard } from '@/src/features/software-showcase/types';

export const metadata = buildPageMetadata({
  title: 'Software Solutions',
  path: ROUTES.adminSoftwareProjects,
  noIndex: true,
});

async function listAdminSoftwareProjects(): Promise<SoftwareProjectCard[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('software_project_cards')
    .select(
      'id, title, slug, short_description, category_id, category_name, category_slug, industry, business_type, solution_group, software_type, platform_type, cover_card_url, cover_detail_url, starting_price, price_suffix, currency, featured, popular, published, sort_order, created_at, updated_at, deleted_at, screen_count'
    )
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[admin/software-projects]', error.message);
    return [];
  }
  return (data ?? []).map((row) => mapCard(row as Record<string, unknown>));
}

function formatPrice(project: SoftwareProjectCard): string {
  const amount = new Intl.NumberFormat('en-BD').format(project.starting_price);
  return `${project.currency} ${amount}${project.price_suffix ?? ''}`;
}

export default async function AdminSoftwareProjectsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(ROUTES.adminSoftwareProjects)}`);
  if (!isShowcaseViewerRole(profile.role)) redirect('/unauthorized');

  const projects = await listAdminSoftwareProjects();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Products &amp; Services</p>
          <h1 className="font-display text-2xl font-black text-text-primary">Software Solutions</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {projects.length} solution{projects.length === 1 ? '' : 's'} (including drafts)
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
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Solution group</th>
              <th className="px-4 py-3 font-semibold">Published</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Screens</th>
              <th className="px-4 py-3 font-semibold">Edit</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-text-secondary">
                  No software solutions yet. Run <code className="text-xs">npm run seed:admin-showcase</code>.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <div>{project.title}</div>
                    <div className="text-xs text-text-muted">{project.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{project.software_type ?? '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {solutionGroupLabel(project.solution_group)}
                  </td>
                  <td className="px-4 py-3">
                    {project.published ? (
                      <span className="text-emerald-700">Yes</span>
                    ) : (
                      <span className="text-amber-700">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-text-secondary">{formatPrice(project)}</td>
                  <td className="px-4 py-3 tabular-nums text-text-secondary">{project.screen_count}</td>
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
