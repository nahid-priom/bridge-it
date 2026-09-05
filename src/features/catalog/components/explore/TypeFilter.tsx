'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { LISTING_VIEW_TABS } from '@/src/features/ecommerce-showcase/config/constants';

/** Website template page-type filter (query param `view`). */
export function TypeFilter({ onApplied }: { onApplied?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const active = (searchParams.get('view') || 'all').split(',')[0] || 'all';

  const setView = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!id || id === 'all') params.delete('view');
    else params.set('view', id);
    params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
    onApplied?.();
  };

  return (
    <ul className="space-y-0.5" role="listbox" aria-label="Template type">
      {LISTING_VIEW_TABS.filter((tab) => tab.id !== 'all').map((tab) => {
        const selected = active === tab.id;
        return (
          <li key={tab.id}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => setView(tab.id)}
              className={cn(
                focusVisibleRing,
                'w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors',
                selected
                  ? 'bg-[#2563eb]/10 font-semibold text-[#1d4ed8] dark:text-[#93c5fd]'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              )}
            >
              {tab.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
