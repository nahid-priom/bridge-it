import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'overflow-hidden rounded-2xl border border-border-subtle bg-surface',
        className
      )}
    >
      <Skeleton className="aspect-[16/10] w-full rounded-none" rounded="none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
