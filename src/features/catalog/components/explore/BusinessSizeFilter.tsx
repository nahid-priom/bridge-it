'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { cn, focusVisibleRing } from '@/lib/cn';
import {
  parseSoftwareBusinessSizeParam,
  serializeSoftwareBusinessSizes,
  SOFTWARE_BUSINESS_SIZE_OPTIONS,
  type SoftwareBusinessSizeId,
} from './types';

export function BusinessSizeFilter({ onApplied }: { onApplied?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const selected = parseSoftwareBusinessSizeParam(searchParams.get('size'));

  const toggle = (id: SoftwareBusinessSizeId) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    const params = new URLSearchParams(searchParams.toString());
    const serialized = serializeSoftwareBusinessSizes(next);
    if (serialized) params.set('size', serialized);
    else params.delete('size');
    params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
    onApplied?.();
  };

  return (
    <fieldset className="space-y-0.5">
      <legend className="sr-only">Business size</legend>
      {SOFTWARE_BUSINESS_SIZE_OPTIONS.map((item) => {
        const checked = selected.includes(item.id);
        const inputId = `business-size-${item.id}`;
        return (
          <label
            key={item.id}
            htmlFor={inputId}
            className={cn(
              focusVisibleRing,
              'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
              checked
                ? 'bg-[#2563eb]/10 font-semibold text-[#1d4ed8] dark:text-[#93c5fd]'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary'
            )}
          >
            <input
              id={inputId}
              type="checkbox"
              checked={checked}
              onChange={() => toggle(item.id)}
              className="h-4 w-4 rounded border-border-subtle text-[#2563eb] focus:ring-[#2563eb]"
            />
            {item.label}
          </label>
        );
      })}
    </fieldset>
  );
}
