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
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-0.5 h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="mt-auto h-10 w-full" rounded="xl" />
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
