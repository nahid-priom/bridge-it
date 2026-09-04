'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CreativeMoreFiltersSheet } from '@/src/features/creative-marketing-showcase/public/CreativeMoreFiltersSheet';
import {
  parseCreativeMoreParam,
  serializeCreativeMoreParam,
  type CreativeMoreFilterId,
} from '@/src/features/creative-marketing-showcase/config/constants';

export function ExploreCreativeMoreFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const applied = parseCreativeMoreParam(searchParams.get('more'));

  const write = (next: CreativeMoreFilterId[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const serialized = serializeCreativeMoreParam(next);
    if (serialized) params.set('more', serialized);
    else params.delete('more');
    params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  return (
    <CreativeMoreFiltersSheet
      applied={applied}
      onApply={write}
      onClear={() => write([])}
    />
  );
}
