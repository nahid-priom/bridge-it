import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { getAdminClient } from '@/lib/services/client';
import { ROUTES } from '@/lib/routes';
import { CatalogIndustriesAdmin } from '@/src/features/catalog/admin/CatalogIndustriesAdmin';
import type { CatalogIndustry } from '@/src/features/catalog/types';

export const dynamic = 'force-dynamic';

export default async function CatalogIndustriesAdminPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(ROUTES.adminCatalogIndustries)}`);
  if (!isShowcaseViewerRole(profile.role)) redirect(ROUTES.admin);

  const supabase = await getAdminClient();
  if (!supabase) {
    return <p className="p-8 text-sm text-text-muted">Database unavailable</p>;
  }

  const { data } = await supabase
    .from('catalog_industries')
    .select(
      'id, category_root, name, slug, short_description, description, seo_title, seo_description, seo_h1, seo_intro, sort_order, active, created_at, updated_at, deleted_at'
    )
    .is('deleted_at', null)
    .order('category_root')
    .order('sort_order');

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-black text-text-primary">Catalog Industries</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage SEO landing pages for /software, /websites, and /marketing industry hubs. Changing a
          published slug creates permanent redirects.
        </p>
      </header>
      <CatalogIndustriesAdmin industries={(data ?? []) as CatalogIndustry[]} />
    </div>
  );
}
