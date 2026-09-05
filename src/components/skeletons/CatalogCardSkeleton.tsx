import { cn } from '@/lib/cn';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { Skeleton } from './Skeleton';

/** Matches catalog ProjectCard / SoftwareCard / CreativeMarketingCard home layout. */
export function CatalogCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface sm:rounded-2xl',
        className
      )}
    >
      <Skeleton rounded="none" className="aspect-card w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-1 border-t border-border-subtle/70 px-2.5 py-2 sm:gap-1.5 sm:px-3 sm:py-2.5">
        <div className="flex min-h-[2.5em] items-center">
          <div className="w-full space-y-1">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-3 w-24" />
        <div className="min-h-[2.5em] space-y-1">
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
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
      className={cn(
        CATALOG_LISTING_GRID_CLASS,
        className
      )}
      aria-busy="true"
      aria-label="Loading catalog"
    >
      {Array.from({ length: count }).map((_, index) => (
        <CatalogCardSkeleton key={index} />
      ))}
    </div>
  );
}
