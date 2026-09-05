import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

/** Hero block for product detail route loading / Suspense. */
export function ProductHeroSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1480px] px-4 pb-16 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 xl:px-10',
        className
      )}
      aria-busy="true"
      aria-label="Loading product"
    >
      <div className="mb-4 flex gap-2" aria-hidden>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)] lg:gap-8">
        <div className="min-w-0" aria-hidden>
          <Skeleton className="aspect-video w-full" rounded="2xl" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-24" rounded="xl" />
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-3" aria-hidden>
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-4 h-8 w-40" />
          <Skeleton className="h-12 w-full" rounded="xl" />
          <Skeleton className="h-12 w-full" rounded="xl" />
        </div>
      </div>
    </div>
  );
}
