import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';
import { CatalogGridSkeleton } from './CatalogCardSkeleton';
import { SidebarSkeleton } from './SidebarSkeleton';

/** Full catalog route skeleton matching ExploreCatalogLayout (sidebar + content). */
export function CatalogPageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1480px] min-w-0 overflow-x-hidden px-4 pb-16',
        'pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 xl:px-10',
        className
      )}
      aria-busy="true"
      aria-label="Loading catalog"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(230px,22%)_minmax(0,1fr)] lg:gap-8 xl:gap-10">
        <div className="hidden min-w-0 max-w-[300px] lg:block">
          <div className="sticky top-[calc(var(--header-offset)+0.75rem)] max-h-[calc(100dvh-var(--header-offset)-1.5rem)] overflow-y-auto overscroll-contain pr-1">
            <SidebarSkeleton />
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex gap-2" aria-hidden>
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
          </div>
          <header className="mb-4 md:mb-5" aria-hidden>
            <Skeleton className="h-8 w-64 max-w-full sm:h-9 sm:w-80" />
            <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          </header>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center md:mb-5" aria-hidden>
            <Skeleton className="h-10 w-full max-w-md" rounded="xl" />
            <Skeleton className="h-10 w-28 shrink-0 lg:hidden" rounded="xl" />
            <Skeleton className="ml-auto hidden h-4 w-20 sm:block" />
          </div>
          <CatalogGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}

/** Lightweight explore/portfolio mixed-grid loading shell. */
export function ExplorePortfolioSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1480px] px-4 pb-16 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 xl:px-10',
        className
      )}
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div className="mx-auto max-w-3xl text-center" aria-hidden>
        <Skeleton className="mx-auto h-3 w-24" />
        <Skeleton className="mx-auto mt-3 h-10 w-72 max-w-full sm:h-12 sm:w-96" />
        <Skeleton className="mx-auto mt-3 h-4 w-full max-w-md" />
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-2 md:mt-14" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24" rounded="full" />
        ))}
      </div>
      <div className="mt-6">
        <CatalogGridSkeleton count={8} className="xl:grid-cols-4" />
      </div>
    </div>
  );
}
