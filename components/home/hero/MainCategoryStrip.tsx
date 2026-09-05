import Link from 'next/link';
import { Code2, LayoutTemplate, Megaphone, type LucideIcon } from 'lucide-react';
import { NAV_CATEGORY_PILLARS, type NavCategoryPillarId } from '@/components/navbar/categoryNav';
import { cn } from '@/lib/cn';

const SHORT_TITLES: Record<NavCategoryPillarId, string> = {
  websites: 'Websites',
  software: 'Software',
  marketing: 'Marketing',
};

const PILLAR_ICONS: Record<NavCategoryPillarId, LucideIcon> = {
  websites: LayoutTemplate,
  software: Code2,
  marketing: Megaphone,
};

const mainCategories = NAV_CATEGORY_PILLARS.map((pillar) => ({
  key: pillar.id,
  title: SHORT_TITLES[pillar.id],
  href: pillar.href,
  Icon: PILLAR_ICONS[pillar.id],
}));

export function MainCategoryStrip({ className }: { className?: string }) {
  return (
    <section
      id="business-solutions"
      aria-labelledby="business-solutions-heading"
      className={cn(
        'scroll-mt-[calc(var(--header-offset)+0.75rem)] border-y border-border-subtle/50 bg-transparent',
        'py-5 md:py-7 lg:py-9',
        className
      )}
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2
          id="business-solutions-heading"
          className="text-center font-display text-lg font-bold tracking-[-0.03em] text-text-primary sm:text-xl md:text-2xl"
        >
          What We Build
        </h2>

        <nav aria-label="Main solution categories" className="mt-3.5 w-full min-w-0 sm:mt-4">
          <ul className="grid w-full min-w-0 grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4">
            {mainCategories.map(({ key, title, href, Icon }) => (
              <li key={key} className="min-w-0">
                <Link
                  href={href}
                  className={cn(
                    'main-category-card group flex h-full min-w-0 flex-col items-center justify-center',
                    'gap-2 px-2 py-3 sm:gap-2.5 sm:px-3 sm:py-3.5 md:px-4 md:py-4',
                    'rounded-2xl transition-[transform,box-shadow,border-color] duration-300',
                    'hover:-translate-y-1',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                    `main-category-card--${key}`
                  )}
                >
                  <span
                    className={cn('main-category-icon', `main-category-icon--${key}`)}
                    aria-hidden
                  >
                    <Icon
                      className="main-category-icon__glyph h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5"
                      strokeWidth={2.25}
                    />
                  </span>
                  <span className="relative z-[1] whitespace-nowrap text-center text-[0.8125rem] font-bold tracking-[-0.02em] text-text-primary sm:text-[0.9375rem] md:text-base">
                    {title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
