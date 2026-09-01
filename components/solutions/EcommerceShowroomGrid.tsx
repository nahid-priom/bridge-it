'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { FlagshipWithFeatures } from '@/lib/services/ecommerce-showroom.service';
import { FlagshipShowroomCard } from '@/components/solutions/FlagshipShowroomCard';
import { cn } from '@/lib/cn';

type EcommerceShowroomGridProps = {
  flagships: FlagshipWithFeatures[];
};

type PriceFilter = 'all' | 'budget' | 'mid' | 'premium';

const PRICE_TIERS: { id: PriceFilter; label: string; min: number; max: number }[] = [
  { id: 'all', label: 'All', min: 0, max: Infinity },
  { id: 'budget', label: 'Under ৳5k', min: 0, max: 4999 },
  { id: 'mid', label: '৳5k – ৳20k', min: 5000, max: 20000 },
  { id: 'premium', label: '৳20k+', min: 20001, max: Infinity },
];

export function EcommerceShowroomGrid({ flagships }: EcommerceShowroomGridProps) {
  const [query, setQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const filtered = useMemo(() => {
    const tier = PRICE_TIERS.find((t) => t.id === priceFilter)!;
    let list = flagships.filter((p) => {
      const price = Number(p.starting_price);
      const inTier = price >= tier.min && price <= tier.max;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.short_description ?? '').toLowerCase().includes(q) ||
        (p.target_customer ?? '').toLowerCase().includes(q);
      return inTier && matchesQuery;
    });

    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => Number(a.starting_price) - Number(b.starting_price));
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => Number(b.starting_price) - Number(a.starting_price));
    }

    return list;
  }, [flagships, query, priceFilter, sort]);

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search solutions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRICE_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setPriceFilter(tier.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                priceFilter === tier.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-text-secondary hover:bg-slate-200 dark:hover:bg-white/10'
              )}
            >
              {tier.label}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="ml-auto text-xs rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 bg-white dark:bg-surface"
            aria-label="Sort solutions"
          >
            <option value="default">Default order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
          <p className="text-lg font-semibold text-text-primary mb-2">No E-commerce solutions available</p>
          <p className="text-sm text-text-secondary">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          {filtered.map((product) => (
            <FlagshipShowroomCard
              key={product.id}
              product={product}
              topFeatures={product.topFeatures}
            />
          ))}
        </div>
      )}
    </>
  );
}
