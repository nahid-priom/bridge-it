import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

/** Matches live ProjectCard layout for minimal CLS. */
export function ProjectCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface',
        className
      )}
    >
      <Skeleton
        rounded="none"
        className="aspect-[16/10] min-h-[220px] w-full rounded-none sm:min-h-[260px]"
      />
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-1 h-5 w-3/4" />
          <Skeleton className="mt-1.5 h-4 w-full" />
        </div>
        <Skeleton className="mt-auto h-7 w-full" />
        <Skeleton className="h-10 w-full" rounded="xl" />
      </div>
    </div>
  );
}
