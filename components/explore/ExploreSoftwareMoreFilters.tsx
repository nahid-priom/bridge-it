'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SoftwareMoreFiltersSheet } from '@/src/features/software-showcase/public/SoftwareMoreFiltersSheet';
import {
  parseSoftwareMoreParam,
  type SoftwareMoreFilterId,
} from '@/src/features/software-showcase/config/constants';

export function ExploreSoftwareMoreFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const applied = parseSoftwareMoreParam(searchParams.get('more'));

  const write = (next: SoftwareMoreFilterId[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.length) params.set('more', next.join(','));
    else params.delete('more');
    params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  return (
    <SoftwareMoreFiltersSheet
      applied={applied}
      onApply={write}
      onClear={() => write([])}
    />
  );
}
