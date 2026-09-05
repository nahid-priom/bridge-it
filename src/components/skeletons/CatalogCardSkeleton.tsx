import { cn } from '@/lib/cn';
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
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-16" />
          </div>
          <Skeleton className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" rounded="full" />
        </div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-4/5" />
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
        'grid grid-cols-1 gap-5 min-[360px]:grid-cols-2 md:grid-cols-3 md:gap-6 xl:grid-cols-3',
        'max-md:[&>*:nth-child(n+5)]:hidden',
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
