import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';
import { WebsitePreviewSkeleton } from './PreviewSkeleton';

export function DetailPageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('mx-auto max-w-[1440px] px-4 pb-16 pt-8', className)} aria-busy="true">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="min-w-0 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-3/4 max-w-lg" />
          <Skeleton className="h-5 w-full max-w-md" />
          <Skeleton className="h-5 w-40" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-9 w-28" rounded="xl" />
            <Skeleton className="h-9 w-28" rounded="xl" />
            <Skeleton className="h-9 w-24" rounded="xl" />
          </div>
          <WebsitePreviewSkeleton />
        </div>
        <aside className="space-y-4" aria-hidden>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" rounded="2xl" />
          <Skeleton className="h-24 w-full" rounded="2xl" />
          <Skeleton className="h-12 w-full" rounded="xl" />
        </aside>
      </div>
    </div>
  );
}
