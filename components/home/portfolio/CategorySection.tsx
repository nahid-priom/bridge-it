import { cn } from '@/lib/cn';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import {
  PortfolioCard,
  normalizeWebsiteProject,
  normalizeSoftwareProject,
  normalizeMarketingProject,
} from '@/src/features/catalog/components/portfolio-card';
import { CategoryHeader } from './CategoryHeader';
import { SectionContainer, portfolioCategorySpacing } from './SectionContainer';
import type { PortfolioSection } from './types';

const HOME_GRID_CLASS = `${CATALOG_LISTING_GRID_CLASS} max-md:[&>*:nth-child(n+5)]:hidden`;

export function CategorySection({
  section,
  className,
}: {
  section: PortfolioSection;
  className?: string;
}) {
  if (section.projects.length === 0) return null;

  return (
    <section
      id={section.id}
      aria-labelledby={section.headingId}
      className={cn(portfolioCategorySpacing, className)}
    >
      <SectionContainer>
        <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400 sm:mb-2 sm:text-xs">
          {section.eyebrow}
        </p>
        <CategoryHeader
          title={section.title}
          description={section.description}
          viewAllHref={section.viewAllHref}
          viewAllLabel={section.viewAllLabel}
          headingId={section.headingId}
        />
        <ul className={HOME_GRID_CLASS}>
          {section.kind === 'website'
            ? section.projects.map((project, index) => (
                <li key={project.id} className="min-w-0 list-none">
                  <PortfolioCard
                    data={normalizeWebsiteProject(project)}
                    eager={index < section.eagerCount}
                    priority={section.eagerCount > 0 && index === 0}
                  />
                </li>
              ))
            : null}
          {section.kind === 'software'
            ? section.projects.map((project, index) => (
                <li key={project.id} className="min-w-0 list-none">
                  <PortfolioCard
                    data={normalizeSoftwareProject(project)}
                    eager={index < section.eagerCount}
                    priority={section.eagerCount > 0 && index === 0}
                  />
                </li>
              ))
            : null}
          {section.kind === 'creative'
            ? section.projects.map((project, index) => (
                <li key={project.id} className="min-w-0 list-none">
                  <PortfolioCard
                    data={normalizeMarketingProject(project)}
                    eager={index < section.eagerCount}
                    priority={section.eagerCount > 0 && index === 0}
                  />
                </li>
              ))
            : null}
        </ul>
      </SectionContainer>
    </section>
  );
}
