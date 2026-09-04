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
        'scroll-mt-[calc(var(--header-offset)+0.75rem)] border-y border-border-subtle/60 bg-transparent',
        'py-6 md:py-8 lg:py-10',
        className
      )}
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2
          id="business-solutions-heading"
          className="text-center font-display text-xl font-bold tracking-[-0.02em] text-text-primary sm:text-2xl"
        >
          What We Build
        </h2>

        <nav aria-label="Main solution categories" className="mt-3 w-full min-w-0 sm:mt-3.5">
          <ul className="grid w-full min-w-0 grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {mainCategories.map(({ key, title, href, Icon }) => (
              <li key={key} className="min-w-0">
                <Link
                  href={href}
                  className={cn(
                    'main-category-card group flex h-full min-w-0 flex-col items-center justify-center',
                    'gap-2 px-2 py-4 sm:gap-2.5 sm:px-3 sm:py-5 md:px-4 md:py-6',
                    'rounded-[1.125rem] transition-[transform,box-shadow,border-color] duration-200',
                    'hover:-translate-y-0.5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    `main-category-card--${key}`
                  )}
                >
                  <span
                    className={cn('service-category-icon', `service-category-icon--${key}`)}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" strokeWidth={2} />
                  </span>
                  <span className="relative z-[1] text-center text-[0.8125rem] font-bold tracking-[-0.015em] text-text-primary sm:text-base md:text-lg">
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
