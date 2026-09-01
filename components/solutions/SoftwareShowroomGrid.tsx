'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { SoftwareFlagshipWithFeatures } from '@/lib/services/software-showroom.service';
import { SoftwareFlagshipCard } from '@/components/solutions/SoftwareFlagshipCard';
import { cn } from '@/lib/cn';

type SoftwareShowroomGridProps = {
  flagships: SoftwareFlagshipWithFeatures[];
};

type PriceFilter = 'all' | 'budget' | 'mid' | 'premium' | 'enterprise';

const PRICE_TIERS: { id: PriceFilter; label: string; min: number; max: number }[] = [
  { id: 'all', label: 'All', min: 0, max: Infinity },
  { id: 'budget', label: 'Under ৳20k', min: 0, max: 19999 },
  { id: 'mid', label: '৳20k – ৳50k', min: 20000, max: 50000 },
  { id: 'premium', label: '৳50k – ৳100k', min: 50001, max: 100000 },
  { id: 'enterprise', label: '৳100k+', min: 100001, max: Infinity },
];

export function SoftwareShowroomGrid({ flagships }: SoftwareShowroomGridProps) {
  const [query, setQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');

  const filtered = useMemo(() => {
    const tier = PRICE_TIERS.find((t) => t.id === priceFilter)!;
    return flagships.filter((p) => {
      const price = Number(p.starting_price);
      const inTier = price >= tier.min && price <= tier.max;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.short_description ?? '').toLowerCase().includes(q) || (p.target_customer ?? '').toLowerCase().includes(q);
      return inTier && matchesQuery;
    });
  }, [flagships, query, priceFilter]);

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search software solutions..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {PRICE_TIERS.map((tier) => (
            <button key={tier.id} type="button" onClick={() => setPriceFilter(tier.id)} className={cn('px-3 py-1.5 rounded-full text-xs font-semibold transition-colors', priceFilter === tier.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-text-secondary hover:bg-slate-200 dark:hover:bg-white/10')}>
              {tier.label}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
          <p className="text-lg font-semibold mb-2">No software solutions found</p>
          <p className="text-sm text-text-secondary">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          {filtered.map((product) => (
            <SoftwareFlagshipCard key={product.id} product={product} topFeatures={product.topFeatures} />
          ))}
        </div>
      )}
    </>
  );
}
