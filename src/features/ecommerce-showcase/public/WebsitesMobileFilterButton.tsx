'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { parseFilterList, serializeFilterList } from '../utils/filters';
import { WebsiteFilterGroups } from './WebsiteFilterGroups';

export function WebsitesMobileFilterButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const appliedViews = useMemo(
    () => parseFilterList(searchParams.get('view') || searchParams.get('page')),
    [searchParams]
  );
  const appliedCategories = useMemo(
    () => parseFilterList(searchParams.get('category')),
    [searchParams]
  );

  const [draftViews, setDraftViews] = useState(appliedViews);
  const [draftCategories, setDraftCategories] = useState(appliedCategories);

  useEffect(() => {
    if (!open) {
      setDraftViews(appliedViews);
      setDraftCategories(appliedCategories);
    }
  }, [appliedViews, appliedCategories, open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const activeCount = appliedViews.length + appliedCategories.length;

  const apply = (views: string[], categories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const view = serializeFilterList(views);
    const category = serializeFilterList(categories);
    if (view) params.set('view', view);
    else params.delete('view');
    params.delete('page');
    if (category) params.set('category', category);
    else params.delete('category');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold lg:hidden',
          activeCount
            ? 'border-[#2563eb] bg-[#2563eb] text-white'
            : 'border-border-subtle bg-surface text-text-primary'
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
        Filters
        {activeCount > 0 ? (
          <span className="rounded-full bg-white/20 px-1.5 text-[11px] leading-4">{activeCount}</span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-website-filters-title"
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border border-border-subtle bg-background p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="mobile-website-filters-title" className="font-display text-lg font-bold">
                Refine results
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-text-muted hover:bg-slate-100 dark:hover:bg-white/10"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <WebsiteFilterGroups
              views={draftViews}
              categories={draftCategories}
              onViewsChange={setDraftViews}
              onCategoriesChange={setDraftCategories}
            />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => apply([], [])}
                className="rounded-xl border border-border-subtle py-3 text-sm font-semibold"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => apply(draftViews, draftCategories)}
                className="rounded-xl bg-[#2563eb] py-3 text-sm font-semibold text-white"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
