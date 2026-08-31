import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { getBitpClientProjects } from '@/lib/services/dashboard.service';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

export const metadata = buildPageMetadata({
  title: 'Projects | Bridge IT Park',
  path: '/dashboard/projects',
  noIndex: true,
});

const STAGE_COLORS: Record<string, string> = {
  pending: 'bg-slate-200 dark:bg-white/10',
  in_progress: 'bg-deshi-green',
  completed: 'bg-emerald-600',
  skipped: 'bg-slate-300',
};

export default async function ClientProjectsPage() {
  const projects = await getBitpClientProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-sm text-text-secondary mt-1">Track progress on your active projects.</p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-12 text-center">
          <p className="text-text-secondary">No active projects yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={ROUTES.clientProject(project.id)}
              className="block rounded-2xl border border-slate-200 dark:border-white/10 p-5 hover:border-deshi-green/40 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="font-bold">{project.title}</h2>
                  <p className="text-sm text-text-secondary capitalize mt-1">{project.status.replace(/_/g, ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-deshi-green">{project.progress_percent}%</p>
                </div>
              </div>
              {project.stages && project.stages.length > 0 && (
                <div className="flex gap-1 mt-4">
                  {project.stages.map((stage) => (
                    <div
                      key={stage.id}
                      className={cn('h-1.5 flex-1 rounded-full', STAGE_COLORS[stage.status] ?? 'bg-slate-200')}
                      title={stage.title}
                    />
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
