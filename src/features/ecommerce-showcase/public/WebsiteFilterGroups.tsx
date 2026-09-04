'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { LISTING_CATEGORIES, LISTING_VIEW_TABS } from '../config/constants';
import { toggleFilterValue } from '../utils/filters';

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]',
        active
          ? 'bg-[#2563eb] text-white'
          : 'bg-slate-100 text-text-secondary hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15'
      )}
    >
      {children}
    </button>
  );
}

export function WebsiteFilterGroups({
  views,
  categories,
  onViewsChange,
  onCategoriesChange,
  hideCategories = false,
  hideViews = false,
}: {
  views: string[];
  categories: string[];
  onViewsChange: (next: string[]) => void;
  onCategoriesChange: (next: string[]) => void;
  hideCategories?: boolean;
  hideViews?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {!hideViews ? (
        <div
          className="scrollbar-none min-w-0 overflow-x-auto overscroll-x-contain"
          role="group"
          aria-label="Page type filters"
        >
          <div className="flex w-max gap-2">
            {LISTING_VIEW_TABS.map((tab) => (
              <Chip
                key={tab.id}
                active={tab.id === 'all' ? views.length === 0 : views.includes(tab.id)}
                onClick={() => onViewsChange(toggleFilterValue(views, tab.id))}
              >
                {tab.id === 'all' ? 'All pages' : tab.label}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}

      {!hideCategories ? (
        <div
          className="scrollbar-none min-w-0 overflow-x-auto overscroll-x-contain"
          role="group"
          aria-label="Category filters"
        >
          <div className="flex w-max gap-2.5">
            {LISTING_CATEGORIES.map((item) => {
              const value = item.slug ?? 'all';
              return (
                <Chip
                  key={item.id}
                  active={item.id === 'all' ? categories.length === 0 : categories.includes(value)}
                  onClick={() => onCategoriesChange(toggleFilterValue(categories, value))}
                >
                  {item.id === 'all' ? 'All' : item.label}
                </Chip>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
