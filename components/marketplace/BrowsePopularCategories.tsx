import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import type { MarketplaceCategory } from '@/types/marketplace';
import { MAIN_CATEGORY_EMOJI } from '@/constants/mainMarketplaceCategories';
import { ROUTES, marketplaceCategorySearchUrl } from '@/lib/routes';
import { cn } from '@/lib/cn';

type BrowsePopularCategoriesProps = {
  categories: MarketplaceCategory[];
};

const MORE_CARD = {
  name: 'More',
  subtitle: '500+ categories',
  href: ROUTES.categories,
  icon: '➕',
  serviceLabel: '500+ categories',
} as const;

export function BrowsePopularCategories({ categories }: BrowsePopularCategoriesProps) {
  const browseCategories = [...categories]
    .filter((c) => c.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 5);

  return (
    <section
      className="py-4 md:py-8 bg-white dark:bg-[#080b16]"
      aria-labelledby="browse-categories-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2
              id="browse-categories-heading"
              className="text-xl md:text-2xl font-black font-display text-text-primary"
            >
              Browse Popular Categories
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Explore high-demand services across Bangladesh&apos;s top categories
            </p>
          </div>
          <Link
            href={ROUTES.categories}
            className="inline-flex items-center gap-1 text-sm font-semibold text-deshi-green hover:underline shrink-0"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
          role="list"
        >
          {browseCategories.map((category) => (
            <Link
              key={category.id}
              href={marketplaceCategorySearchUrl(category.slug)}
              role="listitem"
              className={cn(
                'group flex flex-col rounded-2xl border border-slate-200/80 dark:border-white/10',
                'bg-deshi-mint/25 dark:bg-[#0f1424] p-4 min-h-[120px]',
                'hover:border-deshi-green/40 hover:shadow-md hover:shadow-deshi-green/10',
                'hover:-translate-y-0.5 transition-all duration-300'
              )}
            >
              <span className="text-2xl mb-2" aria-hidden>
                {category.icon ?? MAIN_CATEGORY_EMOJI[category.slug] ?? '📦'}
              </span>
              <h3 className="text-sm font-bold text-text-primary group-hover:text-deshi-green transition-colors line-clamp-2">
                {category.name}
              </h3>
              {category.subtitle && (
                <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                  {category.subtitle}
                </p>
              )}
              <p className="mt-auto pt-2 text-xs font-semibold text-deshi-green">
                {category.serviceCount}+ services
              </p>
            </Link>
          ))}

          <Link
            href={MORE_CARD.href}
            role="listitem"
            className={cn(
              'group flex flex-col rounded-2xl border border-dashed border-deshi-green/40',
              'bg-deshi-mint/15 dark:bg-[#0f1424] p-4 min-h-[120px]',
              'hover:border-deshi-green hover:shadow-md hover:-translate-y-0.5 transition-all duration-300'
            )}
          >
            <span className="w-9 h-9 rounded-xl bg-deshi-green/15 flex items-center justify-center mb-2">
              <LayoutGrid className="w-4 h-4 text-deshi-green" aria-hidden />
            </span>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-deshi-green transition-colors">
              {MORE_CARD.name}
            </h3>
            <p className="text-[11px] text-text-secondary mt-1">{MORE_CARD.subtitle}</p>
            <p className="mt-auto pt-2 text-xs font-semibold text-deshi-green">
              {MORE_CARD.serviceLabel}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
