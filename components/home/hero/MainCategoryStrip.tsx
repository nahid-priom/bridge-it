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
        'scroll-mt-[calc(var(--header-offset)+0.75rem)] border-y border-border-subtle bg-background-soft/40',
        'py-10 md:py-14 lg:py-16',
        className
      )}
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2
          id="business-solutions-heading"
          className="text-center font-display text-xl font-black tracking-[-0.02em] text-text-primary sm:text-2xl"
        >
          What We Build
        </h2>

        <nav aria-label="Main solution categories" className="mt-5 w-full min-w-0 sm:mt-6 md:mt-7">
          <ul className="grid w-full min-w-0 grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {mainCategories.map(({ key, title, href, Icon }) => (
              <li key={key} className="min-w-0">
                <Link
                  href={href}
                  className={cn(
                    'main-category-card group flex h-full min-w-0 flex-col items-center justify-center gap-2 px-2 py-3.5',
                    'sm:flex-row sm:gap-2.5 sm:px-3 sm:py-4 md:gap-3 md:px-4 md:py-5',
                    'rounded-[1rem] transition-all duration-200 hover:-translate-y-0.5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                  )}
                >
                  <span
                    className={cn('main-category-icon', `main-category-icon--${key}`)}
                    aria-hidden
                  >
                    <Icon className="main-category-icon__glyph h-4 w-4 md:h-[1.15rem] md:w-[1.15rem]" strokeWidth={2.35} />
                  </span>
                  <span className="relative z-[1] min-w-0 text-center text-xs font-semibold tracking-[-0.01em] text-text-primary sm:text-sm md:text-[0.9375rem]">
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
