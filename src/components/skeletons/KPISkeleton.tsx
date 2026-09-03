import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'space-y-3 rounded-2xl border border-border-subtle bg-surface p-4 sm:p-5',
        className
      )}
    >
      <Skeleton className="h-10 w-10" rounded="xl" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-20" />
    </div>
  );
}

export function KPISkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn('grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4', className)}
      aria-busy="true"
      aria-label="Loading metrics"
    >
      {Array.from({ length: count }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  );
}
