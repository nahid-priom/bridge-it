import { notFound, redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { getAdminClient } from '@/lib/services/client';
import { getSoftwareProjectBySlug } from '@/src/features/software-showcase/api/projects';
import { SoftwareAdminEditForm } from '@/src/features/software-showcase/admin/SoftwareAdminEditForm';
import type {
  ShowcaseCategory,
  ShowcaseChildCategory,
  ShowcaseMainCategory,
} from '@/src/features/software-showcase/types';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return buildPageMetadata({
    title: `Edit ${slug}`,
    path: `${ROUTES.adminSoftwareProjects}/${slug}`,
    noIndex: true,
  });
}

export default async function AdminSoftwareProjectEditPage({ params }: { params: Params }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(ROUTES.adminSoftwareProjects)}`);
  if (!isShowcaseViewerRole(profile.role)) redirect('/unauthorized');

  const { slug } = await params;
  const project = await getSoftwareProjectBySlug(slug, { includeDrafts: true });
  if (!project) notFound();

  const supabase = await getAdminClient();
  const [mains, categories, children] = supabase
    ? await Promise.all([
        supabase.from('showcase_main_categories').select('*').is('deleted_at', null).order('sort_order'),
        supabase.from('showcase_categories').select('*').is('deleted_at', null).order('sort_order'),
        supabase.from('showcase_child_categories').select('*').is('deleted_at', null).order('sort_order'),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <SoftwareAdminEditForm
        project={project}
        taxonomy={{
          mains: (mains.data ?? []) as ShowcaseMainCategory[],
          categories: (categories.data ?? []) as ShowcaseCategory[],
          children: (children.data ?? []) as ShowcaseChildCategory[],
        }}
        features={project.features}
        screens={project.screens}
      />
    </div>
  );
}
