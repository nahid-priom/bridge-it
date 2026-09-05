import { Suspense, type ReactNode } from 'react';
import { CatalogBreadcrumb } from '../CatalogBreadcrumb';
import type { CatalogBreadcrumbItem, CatalogCategoryRoot } from '../../types';
import { CatalogSidebar } from './CatalogSidebar';
import { CatalogToolbar } from './CatalogToolbar';
import { CatalogResultsProvider } from './CatalogResultsContext';
import type { CatalogSidebarIndustry } from './types';
import { SidebarSkeleton } from '@/src/components/skeletons/SidebarSkeleton';

export function ExploreCatalogLayout({
  activeRoot,
  activeIndustrySlug,
  industries,
  breadcrumbs,
  title,
  description,
  children,
  resultCount,
  beforeToolbar,
  toolbarSlot,
}: {
  activeRoot: CatalogCategoryRoot;
  activeIndustrySlug?: string | null;
  industries: CatalogSidebarIndustry[];
  breadcrumbs: CatalogBreadcrumbItem[];
  title: string;
  description: string;
  children: ReactNode;
  resultCount?: number | null;
  /** Optional content between header and toolbar (e.g. software packages). */
  beforeToolbar?: ReactNode;
  /** Optional client toolbar override (e.g. live result count). */
  toolbarSlot?: ReactNode;
}) {
  return (
    <CatalogResultsProvider initialTotal={resultCount ?? null}>
      <div className="mx-auto w-full max-w-[1480px] min-w-0 overflow-x-hidden px-4 pb-16 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(230px,22%)_minmax(0,1fr)] lg:gap-8 xl:gap-10">
          <div className="hidden min-w-0 max-w-[300px] lg:block">
            <div
              className={
                'sticky top-[calc(var(--header-offset)+0.75rem)] max-h-[calc(100dvh-var(--header-offset)-1.5rem)] ' +
                'overflow-y-auto overscroll-contain pr-1'
              }
            >
              <div className="rounded-2xl border border-border-subtle bg-surface/95 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:bg-surface/85 dark:shadow-black/25 sm:p-4">
                <Suspense
                  fallback={<SidebarSkeleton className="border-0 bg-transparent p-0 shadow-none" />}
                >
                  <CatalogSidebar
                    activeRoot={activeRoot}
                    activeIndustrySlug={activeIndustrySlug}
                    industries={industries}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <CatalogBreadcrumb items={breadcrumbs} className="mb-3" />
            <header className="mb-4 md:mb-5">
              <h1 className="font-display text-2xl font-black tracking-tight text-[#0f2744] dark:text-white sm:text-3xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-1.5 max-w-2xl text-sm text-text-secondary md:text-[0.95rem]">
                  {description}
                </p>
              ) : null}
            </header>

            {beforeToolbar}

            {toolbarSlot ?? (
              <Suspense
                fallback={
                  <div className="mb-4 h-10 max-w-md animate-pulse rounded-xl bg-surface motion-reduce:animate-none md:mb-5" />
                }
              >
                <CatalogToolbar
                  activeRoot={activeRoot}
                  activeIndustrySlug={activeIndustrySlug}
                  industries={industries}
                  resultCount={resultCount}
                />
              </Suspense>
            )}

            {children}
          </div>
        </div>
      </div>
    </CatalogResultsProvider>
  );
}
