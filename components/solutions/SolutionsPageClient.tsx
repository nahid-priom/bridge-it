'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';
import type { BitpCategory, BitpProduct } from '@/types/bitp';
import { SolutionCard } from '@/components/solutions/SolutionCard';
import { BrandedEmptyState } from '@/components/ui/BrandedEmptyState';
import { PageHero } from '@/components/ui/PageHero';
import { PAGE_HEROES } from '@/lib/config/page-heroes';
import { ROUTES, solutionsUrl } from '@/lib/routes';
import { cn } from '@/lib/cn';

type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'newest';

type SolutionsPageClientProps = {
  categories: BitpCategory[];
  products: BitpProduct[];
  initialQuery: string;
  initialCategory: string;
  initialSort: SortOption;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export function SolutionsPageClient({
  categories,
  products,
  initialQuery,
  initialCategory,
  initialSort,
}: SolutionsPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const pushFilters = (extra?: { sort?: SortOption; category?: string; q?: string }) => {
    const cat = extra?.category ?? initialCategory;
    const q = extra?.q ?? query;
    const sort = extra?.sort ?? initialSort;
    const params: Record<string, string> = {};
    if (q.trim()) params.q = q.trim();
    if (sort !== 'popular') params.sort = sort;
    router.push(solutionsUrl(cat || undefined, params));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushFilters({ q: query });
  };

  return (
    <div className="pb-16">
      <PageHero
        variant="marketing"
        title={PAGE_HEROES.solutions.title}
        highlightedText={PAGE_HEROES.solutions.highlightedText}
        subtitle={PAGE_HEROES.solutions.subtitle}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-4 py-2 shadow-sm">
            <Search className="w-5 h-5 text-text-secondary shrink-0" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Software, Website, Marketing..."
              className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="deshi-btn-primary px-4 py-2 text-sm rounded-xl">
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <button
            type="button"
            onClick={() => router.push(ROUTES.solutions)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
              !initialCategory
                ? 'bg-deshi-green text-white border-deshi-green'
                : 'border-slate-200 dark:border-white/10 hover:border-deshi-green/40'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => router.push(solutionsUrl(cat.slug))}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
                initialCategory === cat.slug
                  ? 'bg-deshi-green text-white border-deshi-green'
                  : 'border-slate-200 dark:border-white/10 hover:border-deshi-green/40'
              )}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => pushFilters({ sort: opt.value })}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                initialSort === opt.value
                  ? 'border-deshi-green text-deshi-green bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-slate-200 dark:border-white/10 text-text-secondary hover:border-deshi-green/30'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {(initialCategory === 'ecommerce-solutions' || !initialCategory) && (
          <Link
            href={ROUTES.ecommerceShowroom}
            className="mb-4 block rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0f2744]/5 to-emerald-500/10 p-6 hover:border-emerald-500/50 transition-colors"
          >
            <p className="text-sm font-semibold text-deshi-green uppercase tracking-wide">E-commerce Solutions</p>
            <h2 className="text-xl font-black mt-1">Choose Your E-commerce Solution</h2>
            <p className="text-sm text-text-secondary mt-1">Live demos from landing pages to full stores — ৳2K to ৳50K.</p>
          </Link>
        )}

        {(initialCategory === 'software-solutions' || !initialCategory) && (
          <Link
            href={ROUTES.softwareShowroom}
            className="mb-8 block rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0f2744]/5 to-teal-500/10 p-6 hover:border-emerald-500/50 transition-colors"
          >
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Software Solutions</p>
            <h2 className="text-xl font-black mt-1">Custom Business Software Showroom</h2>
            <p className="text-sm text-text-secondary mt-1">Stock to enterprise ERP — try live demos before you order.</p>
          </Link>
        )}

        {products.length === 0 ? (
          <BrandedEmptyState
            title="No solutions"
            highlightedText="found"
            description="Try a different search or browse all categories."
            actionLabel="View all solutions"
            actionHref={ROUTES.solutions}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <SolutionCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
