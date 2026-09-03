import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function TextSkeleton({
  lines = 1,
  className,
  lastLineWidth = 'w-2/3',
}: {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4 w-full', i === lines - 1 && lines > 1 ? lastLineWidth : undefined)}
        />
      ))}
    </div>
  );
}
