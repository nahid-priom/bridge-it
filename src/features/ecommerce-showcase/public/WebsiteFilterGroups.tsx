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

function FilterRow({
  label,
  labelledBy,
  children,
}: {
  label: string;
  labelledBy: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:items-center lg:gap-4">
      <p
        id={labelledBy}
        className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted"
      >
        {label}
      </p>
      <div className="min-w-0 overflow-x-auto overscroll-x-contain scrollbar-none">{children}</div>
    </div>
  );
}

export function WebsiteFilterGroups({
  views,
  categories,
  onViewsChange,
  onCategoriesChange,
}: {
  views: string[];
  categories: string[];
  onViewsChange: (next: string[]) => void;
  onCategoriesChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-3.5">
      <FilterRow label="Page type" labelledBy="websites-filter-page-type">
        <div className="flex w-max gap-2" role="group" aria-labelledby="websites-filter-page-type">
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
      </FilterRow>

      <div className="border-t border-border-subtle" />

      <FilterRow label="Category" labelledBy="websites-filter-category">
        <div className="flex w-max gap-2.5" role="group" aria-labelledby="websites-filter-category">
          {LISTING_CATEGORIES.map((item) => {
            const value = item.slug ?? 'all';
            return (
              <Chip
                key={item.id}
                active={item.id === 'all' ? categories.length === 0 : categories.includes(value)}
                onClick={() => onCategoriesChange(toggleFilterValue(categories, value))}
              >
                {item.id === 'all' ? 'All categories' : item.label}
              </Chip>
            );
          })}
        </div>
      </FilterRow>
    </div>
  );
}
