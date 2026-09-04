'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { WebsitesMoreFiltersSheet } from '@/src/features/ecommerce-showcase/public/WebsitesMoreFiltersSheet';
import { parseFilterList, serializeFilterList } from '@/src/features/ecommerce-showcase/utils/filters';

/** Explore-only: page-type filters via URL `view` param. */
export function ExploreWebsitesMoreFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const views = parseFilterList(searchParams.get('view') || searchParams.get('page'));

  const onViewsChange = (next: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const view = serializeFilterList(next);
    if (view) params.set('view', view);
    else params.delete('view');
    params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  return <WebsitesMoreFiltersSheet views={views} onViewsChange={onViewsChange} />;
}
