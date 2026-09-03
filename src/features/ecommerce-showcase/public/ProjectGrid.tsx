import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { EcommerceProjectCard } from '../types';
import { ProjectCard } from './ProjectCard';

export { ProjectGridSkeleton } from '@/src/components/skeletons/ProjectGridSkeleton';

export function ProjectGrid({
  projects,
  eagerCount = 3,
  priorityFirst = false,
  emptyTitle = 'No websites match these filters',
  emptyDescription = 'Try another category, page type, or search term.',
  emptyActionHref = '/websites',
  emptyActionLabel = 'Clear filters',
  busy = false,
  variant = 'default',
  columns = 'listing',
}: {
  projects: EcommerceProjectCard[];
  eagerCount?: number;
  /** Mark the first card image as LCP priority (one per page). */
  priorityFirst?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;
  busy?: boolean;
  variant?: 'default' | 'home';
  columns?: 'listing' | 'home';
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-white/15">
        <h3 className="font-display text-xl font-bold text-[#0f2744] dark:text-white">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-text-secondary">{emptyDescription}</p>
        <Link href={emptyActionHref} className="mt-5 inline-block text-sm font-semibold text-emerald-700 hover:underline">
          {emptyActionLabel}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6',
        columns === 'home' ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'
      )}
      aria-busy={busy || undefined}
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          eager={index < eagerCount}
          priority={priorityFirst && index === 0}
          variant={variant}
        />
      ))}
    </div>
  );
}
