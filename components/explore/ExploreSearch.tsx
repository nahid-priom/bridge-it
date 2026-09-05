'use client';

import { useEffect, useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import { useWebsiteSearchPlaceholder } from '@/hooks/useWebsiteSearchPlaceholder';
import type { ExploreTypeId } from '@/components/explore/explore-types';

const PLACEHOLDER_BY_TYPE: Record<ExploreTypeId, string> = {
  websites: 'Search templates…',
  software: 'Search software…',
  marketing: 'Search marketing services…',
};

export function ExploreSearch({
  activeType,
  className,
}: {
  activeType: ExploreTypeId;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const q = (searchParams.get('q') ?? searchParams.get('search') ?? '').trim();
  const [value, setValue] = useState(q);
  const typed = useWebsiteSearchPlaceholder(value.length === 0);

  useEffect(() => {
    setValue(q);
  }, [q]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = value.trim();
      if (next === q) return;
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set('q', next);
      else params.delete('q');
      params.delete('search');
      params.delete('page');
      params.set('type', activeType);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 300);
    return () => window.clearTimeout(handle);
  }, [value, q, pathname, router, searchParams, activeType]);

  const placeholder =
    value.length === 0 && typed.placeholder
      ? typed.placeholder
      : PLACEHOLDER_BY_TYPE[activeType];

  return (
    <div className={cn('w-full', className)}>
      <label htmlFor="explore-shared-search" className="sr-only">
        Search across explore catalogs
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden
        />
        <input
          id="explore-shared-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={typed.onFocus}
          onBlur={typed.onBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            'h-10 w-full rounded-full border border-border-subtle bg-surface py-2 pl-10 pr-3.5',
            'text-sm text-text-primary outline-none placeholder:text-text-muted',
            'focus-visible:ring-2 focus-visible:ring-[#2563eb]/35'
          )}
        />
      </div>
    </div>
  );
}
