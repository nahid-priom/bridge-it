import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function FilterSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2 sm:gap-3', className)}
      aria-busy="true"
      aria-label="Loading filters"
    >
      <Skeleton className="h-10 w-full max-w-xs sm:flex-1" rounded="xl" />
      <Skeleton className="h-10 w-36" rounded="xl" />
      <Skeleton className="h-10 w-36" rounded="xl" />
      <div className="flex w-full flex-wrap gap-2 pt-1 sm:w-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" rounded="xl" />
        ))}
      </div>
    </div>
  );
}
