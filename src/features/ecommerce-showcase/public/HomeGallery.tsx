import Link from 'next/link';
import { HOMEPAGE_SECTIONS } from '../config/constants';
import type { HomepageLegacyCategorySection, HomepageSectionsResult } from '../types';
import { HomeShowcaseSection } from './HomeShowcaseSection';

export function HomeGallery({
  sections,
  legacySections,
}: {
  sections: HomepageSectionsResult;
  legacySections: HomepageLegacyCategorySection[];
}) {
  const websiteSections = HOMEPAGE_SECTIONS.map((section, index) => ({
    ...section,
    projects: sections[section.key] ?? [],
    eagerCount: index === 0 ? 3 : 0,
  })).filter((section) => section.projects.length > 0);

  const legacyVisible = legacySections.filter((section) => section.projects.length > 0);

  if (websiteSections.length === 0 && legacyVisible.length === 0) return null;

  return (
    <section
      id="website-templates"
      aria-label="Website Templates"
      className="border-t-0 pt-2 md:pt-4"
    >
      {websiteSections.map((section) => (
        <HomeShowcaseSection
          key={section.key}
          title={section.title}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          projects={section.projects}
          eagerCount={section.eagerCount}
          headingId={`website-section-${section.key}`}
        />
      ))}

      {legacyVisible.map((section) => (
        <HomeShowcaseSection
          key={section.slug}
          title={section.title}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          projects={section.projects}
          headingId={`website-section-${section.slug}`}
        />
      ))}

      <div className="pb-10 md:pb-14">
        <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex min-h-[7.5rem] flex-col items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface px-6 py-7 text-center md:flex-row md:items-center md:px-8 md:text-left">
            <p className="font-display text-xl font-black text-text-primary md:text-2xl">
              Need a custom storefront?
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/websites"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border-subtle px-5 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
              >
                View all websites
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
