'use client';

import type { MarketplaceSellerPortfolioItem } from '@/types/marketplaceSeller';
import { cn } from '@/lib/cn';

const GRADIENTS = [
  'from-blue-600 to-indigo-800',
  'from-emerald-500 to-teal-700',
  'from-amber-500 to-orange-700',
  'from-sky-500 to-blue-800',
];

type SellerPortfolioProps = {
  items: MarketplaceSellerPortfolioItem[];
};

export function SellerPortfolio({ items }: SellerPortfolioProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <article
          key={item.id}
          className="rounded-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            className={cn(
              'aspect-[16/10] bg-gradient-to-br flex flex-col justify-end p-4',
              GRADIENTS[i % GRADIENTS.length]
            )}
          >
            {item.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1">
                {item.category}
              </span>
            )}
            <h3 className="text-lg font-black text-white">{item.title}</h3>
          </div>
          {item.technologies.length > 0 && (
            <div className="p-4 flex flex-wrap gap-1.5">
              {item.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-white/5 text-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
