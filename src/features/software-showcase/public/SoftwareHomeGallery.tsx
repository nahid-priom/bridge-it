import Link from 'next/link';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { SOFTWARE_HOMEPAGE_SECTIONS } from '../config/constants';
import type { SoftwareHomepageSectionsResult, SoftwareProjectCard } from '../types';
import { SoftwareCard } from './SoftwareCard';

function SoftwareHomeSection({
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
  projects: SoftwareProjectCard[];
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
        <ul className={CATALOG_LISTING_GRID_CLASS}>
          {projects.map((project, index) => (
            <li key={project.id} className="min-w-0 list-none">
              <SoftwareCard
                project={project}
                eager={index < eagerCount}
                priority={index === 0 && eagerCount > 0}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SoftwareHomeGallery({
  sections,
}: {
  sections: SoftwareHomepageSectionsResult;
}) {
  const softwareSections = SOFTWARE_HOMEPAGE_SECTIONS.map((section, index) => ({
    ...section,
    projects: sections[section.key] ?? [],
    eagerCount: index === 0 ? 3 : 0,
  })).filter((section) => section.projects.length > 0);

  if (softwareSections.length === 0) return null;

  return (
    <section
      id="software-solutions"
      aria-label="Software Solutions"
      className="mt-2 border-t border-border-subtle/70 pt-4 md:mt-4 md:pt-6"
    >
      {softwareSections.map((section) => (
        <SoftwareHomeSection
          key={section.key}
          title={section.title}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          projects={section.projects}
          eagerCount={section.eagerCount}
          headingId={`software-section-${section.key}`}
        />
      ))}

      <div className="pb-10 md:pb-14">
        <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex min-h-[7.5rem] flex-col items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface px-6 py-7 text-center md:flex-row md:items-center md:px-8 md:text-left">
            <p className="font-display text-xl font-black text-text-primary md:text-2xl">
              Need a custom software solution?
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/software"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border-subtle px-5 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
              >
                View all software
              </Link>
              <Link
                href="/consultation"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Free Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
