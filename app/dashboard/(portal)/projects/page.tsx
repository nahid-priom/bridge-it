import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { ActiveProjectsBoard } from '@/components/client-dashboard/ActiveProjectsBoard';
import { getClientDashboardOverviewData } from '@/lib/db/client-dashboard';
import { ROUTES } from '@/lib/routes';

export const metadata = buildPageMetadata({
  title: 'Projects',
  description: 'Active client projects and milestones.',
  path: '/dashboard/projects',
  noIndex: true,
});

export default async function ClientProjectsPage() {
  const overview = await getClientDashboardOverviewData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Active Projects</h1>
        <p className="text-sm text-text-muted mt-1">
          {overview.projects.length} projects in delivery —{' '}
          <Link href={ROUTES.clientMessages} className="text-deshi-green font-semibold hover:underline">
            message sellers
          </Link>
        </p>
      </div>
      <ActiveProjectsBoard projects={overview.projects} />
    </div>
  );
}
