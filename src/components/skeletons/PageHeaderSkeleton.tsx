import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <header className={cn('max-w-3xl space-y-3', className)} aria-hidden>
      <Skeleton className="h-9 w-72 max-w-full md:h-10" />
      <Skeleton className="h-5 w-full max-w-xl" />
      <Skeleton className="h-4 w-64 max-w-full" />
      <Skeleton className="mt-1 h-4 w-40" />
    </header>
  );
}
