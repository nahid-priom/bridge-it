import { requireShowcaseViewer } from '@/src/features/ecommerce-showcase/api/auth';
import { adminListProjects } from '@/src/features/ecommerce-showcase/api/admin';
import { ShowcaseAdminShell } from '@/src/features/ecommerce-showcase/admin/ShowcaseAdminShell';
import { ProjectList } from '@/src/features/ecommerce-showcase/admin/ProjectList';
import { mapCard } from '@/src/features/ecommerce-showcase/api/projects';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'E-commerce Projects',
  path: '/admin/ecommerce-projects',
  noIndex: true,
});

export default async function AdminEcommerceProjectsPage() {
  const profile = await requireShowcaseViewer();
  const [activeRows, deletedRows] = await Promise.all([
    adminListProjects(),
    profile.role === 'super_admin' ? adminListProjects({ includeDeleted: true }) : Promise.resolve([]),
  ]);
  const projects = activeRows.map((row) => mapCard(row as Record<string, unknown>));
  const deletedProjects = deletedRows
    .map((row) => mapCard(row as Record<string, unknown>))
    .filter((row) => row.deleted_at);

  return (
    <ShowcaseAdminShell profile={profile}>
      <ProjectList projects={projects} deletedProjects={deletedProjects} profile={profile} />
    </ShowcaseAdminShell>
  );
}
