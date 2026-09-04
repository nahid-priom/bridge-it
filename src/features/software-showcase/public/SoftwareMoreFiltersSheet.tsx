'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SOFTWARE_MORE_FILTERS, type SoftwareMoreFilterId } from '../config/constants';

export function SoftwareMoreFiltersSheet({
  applied,
  onApply,
  onClear,
}: {
  applied: SoftwareMoreFilterId[];
  onApply: (next: SoftwareMoreFilterId[]) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SoftwareMoreFilterId[]>(applied);

  useEffect(() => {
    if (!open) setDraft(applied);
  }, [applied, open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const activeCount = applied.length;

  const toggle = (id: SoftwareMoreFilterId) => {
    setDraft((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold',
          activeCount
            ? 'border-[#2563eb] bg-[#2563eb] text-white'
            : 'border-border-subtle bg-surface text-text-primary hover:border-[#2563eb]/40'
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
            aria-labelledby="software-more-filters-title"
            className={cn(
              'absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border border-border-subtle bg-background p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]',
              'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-5'
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="software-more-filters-title" className="font-display text-lg font-bold">
                Solution type
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

            <div className="flex flex-wrap gap-2">
              {SOFTWARE_MORE_FILTERS.map((item) => {
                const active = draft.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={
                      active
                        ? 'rounded-full bg-[#0f2744] px-3.5 py-1.5 text-sm font-semibold text-white'
                        : 'rounded-full border border-border-subtle px-3.5 py-1.5 text-sm font-medium text-text-secondary hover:border-[#2563eb]/40'
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraft([]);
                  onClear();
                  setOpen(false);
                }}
                className="rounded-xl border border-border-subtle py-3 text-sm font-semibold"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply(draft);
                  setOpen(false);
                }}
                className="rounded-xl bg-[#2563eb] py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
