import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function DataTableSkeleton({
  columns = 5,
  rows = 6,
  className,
}: {
  columns?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn(className)} aria-busy="true" aria-label="Loading table">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border-subtle bg-surface lg:block">
        <div className="border-b border-border-subtle bg-background-soft/50 px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-20" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="flex items-center gap-4 px-4 py-4">
              {Array.from({ length: columns }).map((_, col) => (
                <Skeleton
                  key={col}
                  className={cn('h-4', col === 0 ? 'w-32' : col === columns - 1 ? 'w-16' : 'w-24')}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards — matches AdminDataTable lg:hidden pattern */}
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: Math.min(rows, 4) }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-2xl border border-border-subtle bg-surface p-4"
            aria-hidden
          >
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
