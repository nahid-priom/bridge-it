'use client';

import { LISTING_CATEGORIES } from '../config/constants';
import { toggleFilterValue } from '../utils/filters';
import { WebsitesMoreFiltersSheet } from './WebsitesMoreFiltersSheet';
import { cn } from '@/lib/cn';

export function WebsiteFilterToolbar({
  views,
  categories,
  onViewsChange,
  onCategoriesChange,
  hideCategories = false,
}: {
  views: string[];
  categories: string[];
  onViewsChange: (next: string[]) => void;
  onCategoriesChange: (next: string[]) => void;
  hideCategories?: boolean;
}) {
  if (hideCategories) {
    return null;
  }

  return (
    <div
      className="flex w-full min-w-0 items-center gap-2"
      role="region"
      aria-label="Filter website designs"
    >
      <div className="scrollbar-none min-w-0 flex-1 overflow-x-auto overscroll-x-contain">
        <div className="flex w-max gap-2" role="group" aria-label="Category filters">
          {LISTING_CATEGORIES.map((item) => {
            const value = item.slug ?? 'all';
            const active = item.id === 'all' ? categories.length === 0 : categories.includes(value);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => onCategoriesChange(toggleFilterValue(categories, value))}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
                  active
                    ? 'bg-[#2563eb] text-white'
                    : 'bg-slate-100 text-text-secondary hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15'
                )}
              >
                {item.id === 'all' ? 'All' : item.label}
              </button>
            );
          })}
        </div>
      </div>
      <WebsitesMoreFiltersSheet views={views} onViewsChange={onViewsChange} />
    </div>
  );
}
