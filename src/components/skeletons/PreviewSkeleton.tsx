import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

/** In-chrome screenshot placeholder — hero + section blocks. */
export function PreviewContentSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('min-h-[280px] w-full space-y-4 bg-background-soft p-4 sm:p-6', className)}
    >
      <Skeleton rounded="none" className="aspect-[21/9] w-full min-h-[120px] rounded-lg" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <Skeleton className="aspect-square w-full rounded-lg" />
        <Skeleton className="aspect-square w-full rounded-lg" />
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function PreviewSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'overflow-hidden rounded-2xl border border-border-subtle bg-background-soft',
        className
      )}
    >
      <div className="flex items-center gap-2 bg-[#111827] px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </span>
        <Skeleton className="h-3 w-32 bg-white/15" />
      </div>
      <PreviewContentSkeleton />
    </div>
  );
}

export function WebsitePreviewSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)} aria-busy="true">
      <div className="flex flex-wrap items-center gap-2" aria-hidden>
        <Skeleton className="h-9 w-24" rounded="xl" />
        <Skeleton className="h-9 w-24" rounded="xl" />
        <Skeleton className="h-9 w-24" rounded="xl" />
        <div className="ml-auto flex gap-1">
          <Skeleton className="h-9 w-9" rounded="xl" />
          <Skeleton className="h-9 w-9" rounded="xl" />
        </div>
      </div>
      <PreviewSkeleton />
    </div>
  );
}
