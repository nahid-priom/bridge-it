import Link from 'next/link';
import { cn, focusVisibleRing } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { SectionContainer } from './SectionContainer';

export function PortfolioIntro({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="explore-our-work-heading"
      className={cn(
        'scroll-mt-[calc(var(--header-offset)+0.75rem)] pt-[4.5rem] md:pt-[6.875rem]',
        className
      )}
    >
      <SectionContainer className="text-center">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400 sm:text-xs">
          Our Work
        </p>
        <h2
          id="explore-our-work-heading"
          className="mx-auto mt-3 max-w-3xl font-display font-bold tracking-[-0.03em] text-text-primary"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.1 }}
        >
          Explore Our Work
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-muted sm:mt-4 sm:text-base">
          View 500+ live websites, software &amp; marketing projects
        </p>
        <Link
          href={ROUTES.explore}
          className={cn(
            'mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bridge-primary sm:mt-6',
            'transition-colors hover:text-bridge-primary-dark',
            'dark:text-bridge-primary-light dark:hover:text-white',
            focusVisibleRing
          )}
        >
          View all projects →
        </Link>
      </SectionContainer>
    </section>
  );
}
