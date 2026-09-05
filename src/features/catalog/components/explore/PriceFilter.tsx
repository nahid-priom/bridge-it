'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { parseSoftwarePriceParam, SOFTWARE_PRICE_FILTERS } from './types';

export function PriceFilter({ onApplied }: { onApplied?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const active = parseSoftwarePriceParam(searchParams.get('price'));

  const setPrice = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!id) params.delete('price');
    else params.set('price', id);
    params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
    onApplied?.();
  };

  return (
    <fieldset className="space-y-0.5">
      <legend className="sr-only">Price</legend>
      <label
        className={cn(
          focusVisibleRing,
          'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
          !active
            ? 'bg-[#2563eb]/10 font-semibold text-[#1d4ed8] dark:text-[#93c5fd]'
            : 'text-text-secondary hover:bg-surface hover:text-text-primary'
        )}
      >
        <input
          type="radio"
          name="software-price"
          checked={!active}
          onChange={() => setPrice(null)}
          className="h-4 w-4 border-border-subtle text-[#2563eb] focus:ring-[#2563eb]"
        />
        Any Price
      </label>
      {SOFTWARE_PRICE_FILTERS.map((item) => {
        const selected = active === item.id;
        return (
          <label
            key={item.id}
            className={cn(
              focusVisibleRing,
              'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
              selected
                ? 'bg-[#2563eb]/10 font-semibold text-[#1d4ed8] dark:text-[#93c5fd]'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary'
            )}
          >
            <input
              type="radio"
              name="software-price"
              checked={selected}
              onChange={() => setPrice(item.id)}
              className="h-4 w-4 border-border-subtle text-[#2563eb] focus:ring-[#2563eb]"
            />
            {item.label}
          </label>
        );
      })}
    </fieldset>
  );
}
