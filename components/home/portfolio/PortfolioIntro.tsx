import { cn } from '@/lib/cn';
import { SectionContainer } from './SectionContainer';

export function PortfolioIntro({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="explore-our-work-heading"
      className={cn(
        'scroll-mt-[calc(var(--header-offset)+0.75rem)] pt-[3.5rem]',
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
      </SectionContainer>
    </section>
  );
}
