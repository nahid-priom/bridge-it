import Link from 'next/link';
import type { EcommerceProjectCard } from '../types';
import { ProjectGrid } from './ProjectGrid';

export function HomeShowcaseSection({
  title,
  viewAllHref,
  viewAllLabel,
  projects,
  eagerCount = 0,
  headingId,
}: {
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  projects: EcommerceProjectCard[];
  eagerCount?: number;
  headingId: string;
}) {
  if (projects.length === 0) return null;

  return (
    <section className="pt-2 pb-4 md:py-10" aria-labelledby={headingId}>
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-5 flex min-h-[2.75rem] flex-col items-center gap-2 text-center md:mb-6 md:flex-row md:items-center md:justify-between md:text-left">
          <h3
            id={headingId}
            className="font-display text-xl font-black text-text-primary md:text-2xl"
          >
            {title}
          </h3>
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-semibold text-[#2563eb] hover:underline dark:text-[#60a5fa]"
          >
            {viewAllLabel} →
          </Link>
        </div>
        <ProjectGrid
          projects={projects}
          eagerCount={eagerCount}
          priorityFirst={false}
          variant="home"
          columns="listing"
          emptyTitle="No designs in this collection yet"
          emptyDescription="Browse the full website library or check back soon."
          emptyActionHref={viewAllHref}
          emptyActionLabel="Browse websites"
        />
      </div>
    </section>
  );
}
