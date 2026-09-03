import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function TabRowSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const widths = ['w-20', 'w-24', 'w-28', 'w-24', 'w-20', 'w-16', 'w-28'];
  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      aria-busy="true"
      aria-label="Loading page tabs"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn('h-9', widths[i % widths.length])} rounded="lg" />
      ))}
    </div>
  );
}
