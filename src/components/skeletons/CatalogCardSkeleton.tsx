import { cn } from '@/lib/cn';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { Skeleton } from './Skeleton';

/** Matches unified PortfolioCard listing layout. */
export function CatalogCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface sm:rounded-2xl',
        className
      )}
    >
      <Skeleton rounded="none" className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-1.5 border-t border-border-subtle/70 px-3 py-2.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="mt-1 h-5 w-24" />
      </div>
    </div>
  );
}

export function CatalogGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(CATALOG_LISTING_GRID_CLASS, className)}
      aria-busy="true"
      aria-label="Loading catalog"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={index >= 4 ? 'max-md:hidden' : undefined}>
          <CatalogCardSkeleton />
        </div>
      ))}
    </div>
  );
}
