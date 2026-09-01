import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { requireAuth } from '@/lib/auth/require-auth';
import { getProjectById } from '@/lib/services/projects.service';
import { ProjectStageTimeline } from '@/components/client-dashboard/ProjectStageTimeline';
import { ROUTES } from '@/lib/routes';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return buildPageMetadata({
    title: 'Project Details',
    path: `/dashboard/projects/${id}`,
    noIndex: true,
  });
}

export default async function ClientProjectDetailPage({ params }: Props) {
  const user = await requireAuth('/dashboard');
  const { id } = await params;
  const project = await getProjectById(id, user.id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={ROUTES.clientProjects} className="text-xs font-semibold text-deshi-green hover:underline">
          ← Back to projects
        </Link>
        <h1 className="text-2xl font-bold mt-2">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary">
          <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 font-semibold">
            {project.status.replace('_', ' ')}
          </span>
          <span>{project.progress_percent}% complete</span>
          {project.expected_delivery_date && (
            <span>Expected: {new Date(project.expected_delivery_date).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {project.description && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5">
          <h2 className="font-bold mb-2">Overview</h2>
          <p className="text-sm text-text-secondary">{project.description}</p>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5">
        <h2 className="font-bold mb-6">Project Timeline</h2>
        <ProjectStageTimeline stages={project.stages ?? []} />
      </div>
    </div>
  );
}
