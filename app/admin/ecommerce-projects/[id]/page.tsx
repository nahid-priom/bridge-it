import { notFound } from 'next/navigation';
import { requireShowcaseViewer } from '@/src/features/ecommerce-showcase/api/auth';
import { getProjectById, listCategories, listProjectHomepageSections } from '@/src/features/ecommerce-showcase/api/projects';
import { ShowcaseAdminShell } from '@/src/features/ecommerce-showcase/admin/ShowcaseAdminShell';
import { ProjectForm } from '@/src/features/ecommerce-showcase/admin/ProjectForm';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Edit E-commerce Project',
  path: '/admin/ecommerce-projects',
  noIndex: true,
});

export default async function EditEcommerceProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [profile, categories, project, homepageSections] = await Promise.all([
    requireShowcaseViewer(),
    listCategories(true),
    getProjectById(id),
    listProjectHomepageSections(id),
  ]);
  if (!project) notFound();

  return (
    <ShowcaseAdminShell profile={profile}>
      <ProjectForm
        profile={profile}
        categories={categories}
        project={project}
        homepageSections={homepageSections}
      />
    </ShowcaseAdminShell>
  );
}
