'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';

const BreadcrumbOverrideContext = createContext<BreadcrumbItem[] | null>(null);

export function BreadcrumbOverrideProvider({
  items,
  children,
}: {
  items: BreadcrumbItem[];
  children: ReactNode;
}) {
  return (
    <BreadcrumbOverrideContext.Provider value={items}>
      {children}
    </BreadcrumbOverrideContext.Provider>
  );
}

export function useBreadcrumbOverride(): BreadcrumbItem[] | null {
  return useContext(BreadcrumbOverrideContext);
}
