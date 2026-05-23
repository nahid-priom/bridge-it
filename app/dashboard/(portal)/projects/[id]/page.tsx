import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { MilestoneTracker } from '@/components/client-dashboard/MilestoneTracker';
import { ActivityTimeline } from '@/components/client-dashboard/ActivityTimeline';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import { getClientProjectDetailData } from '@/lib/db/client-dashboard';
import { ROUTES } from '@/lib/routes';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = await getClientProjectDetailData(id);
  return buildPageMetadata({
    title: project?.title ?? 'Project',
    description: 'Project details, milestones, and activity.',
    path: `/dashboard/projects/${id}`,
    noIndex: true,
  });
}

export default async function ClientProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getClientProjectDetailData(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={ROUTES.clientProjects}
          className="text-xs font-semibold text-deshi-green hover:underline"
        >
          ← Back to projects
        </Link>
        <h1 className="text-2xl font-bold text-text-primary mt-2">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <StatusBadge status={project.status} />
          <span className="text-sm text-text-muted">
            {project.sellerName} · Due {project.dueDate}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard className="p-5 sm:p-6">
            <h2 className="font-bold mb-2">Overview</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-text-muted">Budget</span>
                <p className="font-bold">৳{project.budget.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-text-muted">Progress</span>
                <p className="font-bold">{project.progress}%</p>
              </div>
            </div>
          </DashboardCard>
          <MilestoneTracker milestones={project.milestones} />
        </div>
        <ActivityTimeline activities={project.activities} />
      </div>
    </div>
  );
}
