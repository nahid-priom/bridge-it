'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { useBreadcrumbOverride } from '@/components/seo/BreadcrumbOverride';
import {
  buildBreadcrumbsFromPathname,
  shouldShowBreadcrumb,
} from '@/lib/seo/breadcrumbs';

import { WebsitesMobileFilterButton } from '@/src/features/ecommerce-showcase/public/WebsitesMobileFilterButton';

export function SiteBreadcrumb() {
  const pathname = usePathname();
  const override = useBreadcrumbOverride();

  if (!shouldShowBreadcrumb(pathname)) return null;

  const items = override ?? buildBreadcrumbsFromPathname(pathname);
  if (items.length <= 1) return null;

  const websitesIndex = pathname === '/websites';

  return (
    <Breadcrumb
      items={items}
      trailing={
        websitesIndex ? (
          <Suspense fallback={<span className="inline-flex h-8 w-[5.75rem] rounded-full bg-background-soft lg:hidden" />}>
            <WebsitesMobileFilterButton />
          </Suspense>
        ) : null
      }
    />
  );
}
