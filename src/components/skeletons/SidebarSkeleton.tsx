import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

/** Compact floating sidebar placeholder for explore catalog layout. */
export function SidebarSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border-subtle bg-surface/95 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:bg-surface/80 dark:shadow-black/20',
        className
      )}
      aria-busy="true"
      aria-label="Loading filters"
    >
      <Skeleton className="mb-4 h-4 w-28" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`nav-${i}`} className="h-9 w-full" rounded="xl" />
        ))}
      </div>
      <div className="my-4 border-t border-border-subtle" />
      <Skeleton className="mb-3 h-3 w-20" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={`filter-${i}`} className="h-8 w-full" rounded="lg" />
        ))}
      </div>
      <div className="my-4 border-t border-border-subtle" />
      <Skeleton className="mb-3 h-3 w-16" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={`chip-${i}`} className="h-7 w-16" rounded="full" />
        ))}
      </div>
    </div>
  );
}
