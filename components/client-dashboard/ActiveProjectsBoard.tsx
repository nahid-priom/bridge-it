'use client';

import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import { ROUTES } from '@/lib/routes';
import type { ClientProject } from '@/types/client-dashboard';

export function ActiveProjectsBoard({ projects }: { projects: ClientProject[] }) {
  return (
    <DashboardCard className="overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10">
        <div>
          <h2 className="text-base font-bold text-text-primary">Active Projects</h2>
          <p className="text-xs text-text-muted">Track delivery & milestones</p>
        </div>
        <Link
          href={ROUTES.clientProjects}
          className="text-xs font-semibold text-deshi-green hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/10">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={ROUTES.clientProject(project.id)}
            className="block px-5 py-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary truncate">
                    {project.title}
                  </h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs text-text-muted">
                  {project.sellerName} · {project.category}
                </p>
                <p className="text-xs text-deshi-green mt-1">{project.milestoneStatus}</p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary tabular-nums">
                    ৳{project.budget.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-text-muted flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3" />
                    {project.dueDate}
                  </p>
                </div>
                <div className="w-24 sm:w-28">
                  <div className="flex justify-between text-[10px] text-text-muted mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-deshi-green to-emerald-400 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
