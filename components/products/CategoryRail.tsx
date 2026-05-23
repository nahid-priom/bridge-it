'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { productCategories } from '@/data/productCategories';
import { getCategoryProductCounts } from '@/data/products';
import type { ProductCategoryKey } from '@/types/product';
import { cn, focusVisibleRing } from '@/lib/cn';

interface CategoryRailProps {
  activeCategory: ProductCategoryKey | null;
  className?: string;
}

export const CategoryRail = memo(function CategoryRail({
  activeCategory,
  className = '',
}: CategoryRailProps) {
  const counts = useMemo(() => getCategoryProductCounts(), []);

  return (
    <nav
      aria-label="Product categories"
      className={cn('mb-5 md:mb-6 w-full min-w-0 max-w-full overflow-hidden', className)}
    >
      <div className="category-rail-scroll overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-proximity">
        <div className="flex flex-nowrap items-center gap-3 w-max min-w-full pr-1">
        {productCategories.map((cat) => {
          const isAll = cat.key === 'all';
          const active = isAll ? !activeCategory : activeCategory === cat.key;
          const count = counts[cat.key] ?? 0;

          return (
            <Link
              key={cat.key}
              href={cat.href}
              scroll={false}
              className={cn(
                'snap-start shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium',
                'border transition-colors',
                focusVisibleRing,
                active
                  ? 'bg-bridge-primary text-white border-bridge-primary shadow-lg shadow-bridge-primary/30'
                  : 'bg-surface text-text-secondary border-border-subtle hover:bg-bridge-primary/10 hover:text-bridge-primary hover:border-bridge-primary/25'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {isAll ? (
                <Home className="w-4 h-4 shrink-0" aria-hidden />
              ) : (
                <span className="text-base leading-none shrink-0" aria-hidden>
                  {cat.icon}
                </span>
              )}
              <span className="whitespace-nowrap">{cat.label}</span>
              <span
                className={cn(
                  'text-xs tabular-nums px-1.5 py-0.5 rounded-full',
                  active ? 'bg-white/20 text-white' : 'bg-background-soft text-text-muted'
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
});
