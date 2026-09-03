import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'overflow-hidden rounded-2xl border border-border-subtle bg-surface',
        className
      )}
    >
      <Skeleton rounded="none" className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
