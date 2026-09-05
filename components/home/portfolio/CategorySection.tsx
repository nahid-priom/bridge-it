import { cn } from '@/lib/cn';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import {
  PortfolioCard,
  normalizeWebsiteProject,
  normalizeSoftwareProject,
  normalizeMarketingProject,
  type PortfolioCardData,
} from '@/src/features/catalog/components/portfolio-card';
import { CategoryHeader } from './CategoryHeader';
import { SectionContainer, portfolioCategorySpacing } from './SectionContainer';
import type { PortfolioSection } from './types';

/** Max cards per homepage category section (desktop / tablet). */
const HOME_SECTION_MAX = 6;
/** Mobile shows first 4; hide 5+. */
const HOME_GRID_CLASS = `${CATALOG_LISTING_GRID_CLASS} max-md:[&>*:nth-child(n+5)]:hidden`;

function toCardData(section: PortfolioSection, projectIndex: number): PortfolioCardData {
  if (section.kind === 'website') return normalizeWebsiteProject(section.projects[projectIndex]!);
  if (section.kind === 'software') return normalizeSoftwareProject(section.projects[projectIndex]!);
  return normalizeMarketingProject(section.projects[projectIndex]!);
}

export function CategorySection({
  section,
  className,
}: {
  section: PortfolioSection;
  className?: string;
}) {
  const projects = section.projects.slice(0, HOME_SECTION_MAX);
  if (projects.length === 0) return null;

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
          {projects.map((project, index) => (
            <li key={project.id} className="min-w-0 list-none">
              <PortfolioCard
                data={toCardData(section, index)}
                eager={index < Math.min(section.eagerCount, 4)}
                priority={section.eagerCount > 0 && index === 0}
              />
            </li>
          ))}
        </ul>
      </SectionContainer>
    </section>
  );
}
