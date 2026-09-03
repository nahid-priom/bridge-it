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
  return (
    <div className="mt-14 md:mt-16">
      {HOMEPAGE_SECTIONS.map((section, index) => (
        <HomeShowcaseSection
          key={section.key}
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          projects={sections[section.key] ?? []}
          eagerCount={index === 0 ? 3 : 0}
        />
      ))}
      {legacySections
        .filter((section) => section.projects.length > 0)
        .map((section) => (
        <HomeShowcaseSection
          key={section.slug}
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          projects={section.projects}
        />
      ))}
      <section className="pb-14 md:pb-20">
        <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border-subtle bg-surface px-6 py-8 md:flex-row md:items-center md:px-8">
            <div>
              <h2 className="font-display text-xl font-black text-text-primary md:text-2xl">
                Need a custom storefront?
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Book a free demo and we will match a design to your brand.
              </p>
            </div>
            <Link
              href="/consultation"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#2563eb] px-6 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
            >
              Get Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
