'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import type { BitpCategory, BitpProduct } from '@/types/bitp';
import { SolutionCard } from '@/components/solutions/SolutionCard';
import { PageHero } from '@/components/ui/PageHero';
import { PAGE_HEROES } from '@/lib/config/page-heroes';
import { ROUTES, solutionsUrl } from '@/lib/routes';
import { cn } from '@/lib/cn';

type SolutionsPageClientProps = {
  categories: BitpCategory[];
  products: BitpProduct[];
  initialQuery: string;
  initialCategory: string;
};

export function SolutionsPageClient({
  categories,
  products,
  initialQuery,
  initialCategory,
}: SolutionsPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(solutionsUrl(initialCategory, { q: query }));
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

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
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

        {products.length === 0 ? (
          <p className="text-center text-text-secondary py-16">No solutions found.</p>
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
