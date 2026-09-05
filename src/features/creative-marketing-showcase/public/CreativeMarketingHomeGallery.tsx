import Link from 'next/link';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { CREATIVE_MARKETING_HOMEPAGE_SECTIONS } from '../config/constants';
import type { CreativeMarketingHomepageSectionsResult, CreativeMarketingProjectCard } from '../types';
import { CreativeMarketingCard } from './CreativeMarketingCard';

function Section({
  title,
  viewAllHref,
  viewAllLabel,
  projects,
  headingId,
}: {
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  projects: CreativeMarketingProjectCard[];
  headingId: string;
}) {
  if (!projects.length) return null;
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
              <CreativeMarketingCard
                project={project}
                eager={index < 3}
                priority={index === 0}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CreativeMarketingHomeGallery({
  sections,
}: {
  sections: CreativeMarketingHomepageSectionsResult;
}) {
  const creativeSections = CREATIVE_MARKETING_HOMEPAGE_SECTIONS.map((section) => ({
    ...section,
    projects: sections[section.key] ?? [],
  })).filter((section) => section.projects.length > 0);

  if (creativeSections.length === 0) return null;

  return (
    <section
      id="creative-marketing"
      aria-label="Creative & Marketing"
      className="mt-2 border-t border-border-subtle/70 pt-4 md:mt-4 md:pt-6"
    >
      {creativeSections.map((section) => (
        <Section
          key={section.key}
          title={section.title}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          projects={section.projects}
          headingId={`creative-section-${section.key}`}
        />
      ))}

      <div className="pb-14 md:pb-20">
        <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex min-h-[7.5rem] flex-col items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface px-6 py-7 text-center md:flex-row md:items-center md:px-8 md:text-left">
            <p className="font-display text-xl font-black text-text-primary md:text-2xl">
              Ready to grow your brand?
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/creative-marketing"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border-subtle px-5 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
              >
                View all creative
              </Link>
              <Link
                href="/consultation"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
