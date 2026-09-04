'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LISTING_VIEW_TABS } from '../config/constants';
import { toggleFilterValue } from '../utils/filters';

export function WebsitesMoreFiltersSheet({
  views,
  onViewsChange,
  className,
}: {
  views: string[];
  onViewsChange: (next: string[]) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(views);

  useEffect(() => {
    if (!open) setDraft(views);
  }, [views, open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const activeCount = views.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
          activeCount
            ? 'border-[#2563eb] bg-[#2563eb] text-white'
            : 'border-border-subtle bg-surface text-text-primary hover:border-[#2563eb]/40',
          className
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="More filters"
      >
        <SlidersHorizontal className="h-3 w-3" aria-hidden />
        More
        {activeCount > 0 ? (
          <span className="rounded-full bg-white/20 px-1.5 text-[10px] leading-4">{activeCount}</span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="websites-more-filters-title"
            className={cn(
              'absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border border-border-subtle bg-background p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]',
              'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-5'
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="websites-more-filters-title" className="font-display text-lg font-bold">
                Page type
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

            <div className="flex flex-wrap gap-2" role="group" aria-label="Page type filters">
              {LISTING_VIEW_TABS.map((tab) => {
                const active = tab.id === 'all' ? draft.length === 0 : draft.includes(tab.id);
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setDraft(tab.id === 'all' ? [] : toggleFilterValue(draft, tab.id))
                    }
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                      active
                        ? 'bg-[#2563eb] text-white'
                        : 'border border-border-subtle bg-surface text-text-secondary hover:border-[#2563eb]/40'
                    )}
                  >
                    {tab.id === 'all' ? 'All pages' : tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  onViewsChange([]);
                  setOpen(false);
                }}
                className="rounded-xl border border-border-subtle py-3 text-sm font-semibold"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  onViewsChange(draft);
                  setOpen(false);
                }}
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
