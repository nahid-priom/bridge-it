'use client';

import { cn } from '@/lib/cn';
import { LISTING_CATEGORIES, LISTING_VIEW_TABS } from '../config/constants';

export function WebsiteFilterToolbar({
  view,
  category,
  onViewChange,
  onCategoryChange,
}: {
  view: string;
  category: string;
  onViewChange: (view: string) => void;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div
      className="w-full rounded-xl border border-border-subtle bg-surface/60 px-3 py-3 sm:px-4"
      role="region"
      aria-label="Website filters"
    >
      <div className="-mx-1 overflow-x-auto px-1 scrollbar-none">
        <div className="flex w-max min-w-full flex-nowrap gap-2 md:flex-wrap" role="tablist" aria-label="Page type">
          {LISTING_VIEW_TABS.map((tab) => {
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onViewChange(tab.id)}
                className={cn(
                  'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
                  active
                    ? 'border-[#2563eb] bg-[#2563eb] text-white'
                    : 'border-border-subtle bg-background text-text-secondary hover:border-[#2563eb]/40'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2.5 -mx-1 overflow-x-auto px-1 scrollbar-none">
        <div className="flex w-max min-w-full flex-nowrap gap-2.5 md:flex-wrap" role="tablist" aria-label="Category">
          {LISTING_CATEGORIES.map((item) => {
            const value = item.slug ?? 'all';
            const active = category === value;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategoryChange(value)}
                className={cn(
                  'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
                  active
                    ? 'border-[#2563eb] bg-[#2563eb] text-white'
                    : 'border-border-subtle bg-background text-text-secondary hover:border-[#2563eb]/40'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
