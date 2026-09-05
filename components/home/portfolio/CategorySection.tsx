import { cn } from '@/lib/cn';
import { ProjectCard } from '@/src/features/ecommerce-showcase/public/ProjectCard';
import { SoftwareCard } from '@/src/features/software-showcase/public/SoftwareCard';
import { CreativeMarketingCard } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCard';
import { CategoryHeader } from './CategoryHeader';
import { SectionContainer, portfolioCategorySpacing } from './SectionContainer';
import type { PortfolioSection } from './types';

const HOME_GRID_CLASS =
  'grid grid-cols-1 gap-2.5 min-[320px]:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4 ' +
  'max-md:[&>*:nth-child(n+5)]:hidden';

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
        <div className={HOME_GRID_CLASS}>
          {section.kind === 'website'
            ? section.projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="home"
                  eager={index < section.eagerCount}
                  priority={section.eagerCount > 0 && index === 0}
                />
              ))
            : null}
          {section.kind === 'software'
            ? section.projects.map((project, index) => (
                <SoftwareCard
                  key={project.id}
                  project={project}
                  variant="home"
                  eager={index < section.eagerCount}
                  priority={section.eagerCount > 0 && index === 0}
                />
              ))
            : null}
          {section.kind === 'creative'
            ? section.projects.map((project, index) => (
                <CreativeMarketingCard
                  key={project.id}
                  project={project}
                  variant="home"
                  eager={index < section.eagerCount}
                  priority={section.eagerCount > 0 && index === 0}
                />
              ))
            : null}
        </div>
      </SectionContainer>
    </section>
  );
}
