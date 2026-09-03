import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function FilterSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'hidden w-full rounded-2xl border border-border-subtle bg-surface px-4 py-4 lg:block',
        className
      )}
      aria-busy="true"
      aria-label="Loading filters"
    >
      <Skeleton className="mb-4 h-4 w-28" />
      <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-4">
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`page-${i}`} className="h-8 w-[4.75rem] shrink-0" rounded="xl" />
          ))}
        </div>
      </div>
      <div className="my-3.5 border-t border-border-subtle" />
      <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-4">
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`cat-${i}`} className="h-8 w-[5.25rem] shrink-0" rounded="xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
