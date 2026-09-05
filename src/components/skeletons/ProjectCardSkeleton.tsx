import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

/** Matches unified PortfolioCard layout for minimal CLS. */
export function ProjectCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface sm:rounded-2xl',
        className
      )}
    >
      <Skeleton rounded="none" className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-1.5 border-t border-border-subtle/70 px-3 py-2.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="mt-1 h-5 w-24" />
      </div>
    </div>
  );
}
