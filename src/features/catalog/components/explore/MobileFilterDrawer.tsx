'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn, focusVisibleInput, focusVisibleRing } from '@/lib/cn';
import type { CatalogCategoryRoot } from '../../types';
import { CatalogSidebar } from './CatalogSidebar';
import {
  catalogSearchPlaceholder,
  effectiveSoftwareSort,
  parseSoftwareSortParam,
  SOFTWARE_SORT_OPTIONS,
  type CatalogSidebarIndustry,
  type SoftwareSortId,
} from './types';

export function MobileFilterDrawer({
  open,
  onClose,
  activeRoot,
  activeIndustrySlug,
  industries,
}: {
  open: boolean;
  onClose: () => void;
  activeRoot: CatalogCategoryRoot;
  activeIndustrySlug?: string | null;
  industries: CatalogSidebarIndustry[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQ = (searchParams.get('q') ?? '').trim();
  const urlSort = effectiveSoftwareSort(searchParams.get('sort'), urlQ);
  const [searchInput, setSearchInput] = useState(urlQ);
  const [sort, setSort] = useState<SoftwareSortId>(urlSort);

  useEffect(() => {
    if (!open) return;
    setSearchInput(urlQ);
    setSort(urlSort);
  }, [open, urlQ, urlSort]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const industryName = activeIndustrySlug
    ? industries.find((i) => i.slug === activeIndustrySlug)?.name
    : null;
  const placeholder = catalogSearchPlaceholder(activeRoot, industryName);
  const searchId = `catalog-filter-search-${activeRoot}`;
  const sortId = `catalog-filter-sort-${activeRoot}`;

  const applyQueryFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    let nextQ = searchInput.trim();

    if (activeRoot === 'software') {
      // Picking a non-relevance sort while a query is present clears search so that sort applies.
      if (nextQ && sort !== 'relevance' && sort !== 'popular') {
        nextQ = '';
      }
      if (!sort || sort === 'popular' || (nextQ && sort === 'relevance')) {
        params.delete('sort');
      } else {
        params.set('sort', sort);
      }
    }

    if (nextQ) params.set('q', nextQ);
    else params.delete('q');

    params.delete('page');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    onClose();
  };

  const clearQueryFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('view');
    params.delete('price');
    params.delete('size');
    params.delete('sort');
    params.delete('q');
    params.delete('page');
    params.delete('category');
    params.delete('more');
    params.delete('group');
    params.delete('child');
    params.delete('solutionGroup');
    const qs = params.toString();
    setSearchInput('');
    setSort('popular');
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    onClose();
  };

  const fieldClass = cn(
    focusVisibleInput,
    'h-10 w-full rounded-xl border border-border-subtle bg-white px-3 text-sm text-text-primary',
    'dark:bg-[#0f2744] dark:text-white dark:border-white/15',
    'scheme-light dark:scheme-dark'
  );

  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl',
          'border border-border-subtle bg-background shadow-2xl'
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 className="text-sm font-bold text-text-primary">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(focusVisibleRing, 'rounded-lg p-2 text-text-muted hover:bg-surface')}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-5 space-y-3 border-b border-border-subtle pb-5">
            <div>
              <label htmlFor={searchId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                Search
              </label>
              <input
                id={searchId}
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyQueryFilters();
                  }
                }}
                placeholder={placeholder}
                className={fieldClass}
              />
            </div>

            {activeRoot === 'software' ? (
              <div>
                <label htmlFor={sortId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Sort
                </label>
                <select
                  id={sortId}
                  value={sort}
                  onChange={(e) => setSort(parseSoftwareSortParam(e.target.value))}
                  className={cn(fieldClass, 'font-medium')}
                >
                  {(searchInput.trim()
                    ? SOFTWARE_SORT_OPTIONS
                    : SOFTWARE_SORT_OPTIONS.filter((opt) => opt.id !== 'relevance')
                  ).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          <CatalogSidebar
            activeRoot={activeRoot}
            activeIndustrySlug={activeIndustrySlug}
            industries={industries}
            onNavigate={onClose}
          />
        </div>

        <div className="sticky bottom-0 flex gap-2 border-t border-border-subtle bg-background px-4 py-3">
          <button
            type="button"
            onClick={clearQueryFilters}
            className={cn(
              focusVisibleRing,
              'flex-1 rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-semibold'
            )}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={applyQueryFilters}
            className={cn(
              focusVisibleRing,
              'flex-1 rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]'
            )}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
