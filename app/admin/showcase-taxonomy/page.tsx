import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { getAdminClient } from '@/lib/services/client';
import { ROUTES } from '@/lib/routes';
import { ShowcaseTaxonomyAdmin } from '@/src/features/software-showcase/admin/ShowcaseTaxonomyAdmin';
import type {
  ShowcaseCategory,
  ShowcaseChildCategory,
  ShowcaseMainCategory,
} from '@/src/features/software-showcase/types';

export const dynamic = 'force-dynamic';

export default async function ShowcaseTaxonomyPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(ROUTES.adminShowcaseTaxonomy)}`);
  if (!isShowcaseViewerRole(profile.role)) redirect(ROUTES.admin);

  const supabase = await getAdminClient();
  if (!supabase) {
    return <p className="p-8 text-sm text-text-muted">Database unavailable</p>;
  }

  const [mains, categories, children] = await Promise.all([
    supabase.from('showcase_main_categories').select('*').is('deleted_at', null).order('sort_order'),
    supabase.from('showcase_categories').select('*').is('deleted_at', null).order('sort_order'),
    supabase.from('showcase_child_categories').select('*').is('deleted_at', null).order('sort_order'),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <ShowcaseTaxonomyAdmin
        mains={(mains.data ?? []) as ShowcaseMainCategory[]}
        categories={(categories.data ?? []) as ShowcaseCategory[]}
        children={(children.data ?? []) as ShowcaseChildCategory[]}
      />
    </div>
  );
}
