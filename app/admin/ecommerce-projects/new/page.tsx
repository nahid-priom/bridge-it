import { requireShowcaseEditor } from '@/src/features/ecommerce-showcase/api/auth';
import { listCategories } from '@/src/features/ecommerce-showcase/api/projects';
import { ShowcaseAdminShell } from '@/src/features/ecommerce-showcase/admin/ShowcaseAdminShell';
import { ProjectForm } from '@/src/features/ecommerce-showcase/admin/ProjectForm';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'New E-commerce Project',
  path: '/admin/ecommerce-projects/new',
  noIndex: true,
});

export default async function NewEcommerceProjectPage() {
  const [profile, categories] = await Promise.all([requireShowcaseEditor(), listCategories(true)]);
  return (
    <ShowcaseAdminShell profile={profile}>
      <ProjectForm profile={profile} categories={categories} />
    </ShowcaseAdminShell>
  );
}
