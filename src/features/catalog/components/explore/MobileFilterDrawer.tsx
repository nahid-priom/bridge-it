'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn, focusVisibleRing } from '@/lib/cn';
import type { CatalogCategoryRoot } from '../../types';
import { CatalogSidebar } from './CatalogSidebar';
import type { CatalogSidebarIndustry } from './types';

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
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    onClose();
  };

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
            onClick={onClose}
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
