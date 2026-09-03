import Link from 'next/link';
import type { EcommerceProjectCard } from '../types';
import { ProjectGrid } from './ProjectGrid';

export function HomeShowcaseSection({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel,
  projects,
  eagerCount = 0,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  viewAllHref: string;
  viewAllLabel: string;
  projects: EcommerceProjectCard[];
  eagerCount?: number;
}) {
  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb] dark:text-[#60a5fa]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-1 font-display text-2xl font-black text-text-primary md:text-3xl">{title}</h2>
            {description ? <p className="mt-1 max-w-xl text-sm text-text-secondary">{description}</p> : null}
          </div>
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
