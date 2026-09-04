'use client';

import { WebsiteFilterGroups } from './WebsiteFilterGroups';

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
  const hasActiveFilters = views.length > 0 || (!hideCategories && categories.length > 0);

  return (
    <div
      className="hidden w-full rounded-2xl border border-border-subtle bg-surface px-4 py-4 lg:block"
      role="region"
      aria-label="Filter website designs"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-text-primary">Refine results</p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => {
              onViewsChange([]);
              if (!hideCategories) onCategoriesChange([]);
            }}
            className="text-sm font-semibold text-[#2563eb] hover:underline dark:text-[#60a5fa]"
          >
            Clear filters
          </button>
        ) : null}
      </div>
      <WebsiteFilterGroups
        views={views}
        categories={categories}
        onViewsChange={onViewsChange}
        onCategoriesChange={onCategoriesChange}
        hideCategories={hideCategories}
      />
    </div>
  );
}
