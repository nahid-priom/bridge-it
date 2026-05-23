'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { useBreadcrumbOverride } from '@/components/seo/BreadcrumbOverride';
import {
  buildBreadcrumbsFromPathname,
  shouldShowBreadcrumb,
} from '@/lib/seo/breadcrumbs';

export function SiteBreadcrumb() {
  const pathname = usePathname();
  const override = useBreadcrumbOverride();

  if (!shouldShowBreadcrumb(pathname)) return null;

  const items = override ?? buildBreadcrumbsFromPathname(pathname);
  if (items.length <= 1) return null;

  return <Breadcrumb items={items} />;
}
