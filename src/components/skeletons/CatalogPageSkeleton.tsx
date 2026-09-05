import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';
import { CatalogGridSkeleton } from './CatalogCardSkeleton';

/**
 * Above-the-fold only catalog route skeleton.
 * Does not replace the full viewport — title + small card grid only.
 */
export function CatalogAboveFoldSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1480px] min-w-0 overflow-x-hidden px-4 pb-10',
        'pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 xl:px-10',
        className
      )}
      aria-busy="true"
      aria-label="Loading catalog"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(230px,22%)_minmax(0,1fr)] lg:gap-8 xl:gap-10">
        {/* Thin sidebar stub — desktop only, not a full SidebarSkeleton */}
        <div className="hidden min-w-0 max-w-[300px] space-y-3 lg:block" aria-hidden>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" rounded="xl" />
          <Skeleton className="h-9 w-full" rounded="xl" />
          <Skeleton className="h-9 w-4/5" rounded="xl" />
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex gap-2" aria-hidden>
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
          </div>
          <header className="mb-4" aria-hidden>
            <Skeleton className="h-8 w-64 max-w-full sm:h-9 sm:w-80" />
            <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          </header>
          {/* Static primary chips — no skeleton strip (appear instantly on real page) */}
          <CatalogGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}

/** @deprecated Prefer CatalogAboveFoldSkeleton for route loading.tsx */
export function CatalogPageSkeleton({ className }: { className?: string }) {
  return <CatalogAboveFoldSkeleton className={className} />;
}

/** Lightweight explore/portfolio mixed-grid loading shell (above-fold). */
export function ExplorePortfolioSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1480px] px-4 pb-10 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 xl:px-10',
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
      <div className="mt-8 flex flex-wrap justify-center gap-2" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24" rounded="full" />
        ))}
      </div>
      <div className="mt-6">
        <CatalogGridSkeleton count={6} className="xl:grid-cols-4" />
      </div>
    </div>
  );
}

/** Compact product detail route loading — not a full-page replacement. */
export function ProductAboveFoldSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1480px] px-4 pb-10 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 xl:px-10',
        className
      )}
      aria-busy="true"
      aria-label="Loading product"
    >
      <div className="mb-3 flex gap-2" aria-hidden>
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-10">
        <div className="min-w-0 space-y-3" aria-hidden>
          <Skeleton className="h-5 w-24" rounded="full" />
          <Skeleton className="h-9 w-full max-w-md" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-5/6 max-w-md" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" rounded="xl" />
            ))}
          </div>
        </div>
        <div className="min-w-0" aria-hidden>
          <Skeleton className="aspect-[16/10] w-full" rounded="2xl" />
        </div>
      </div>
    </div>
  );
}
