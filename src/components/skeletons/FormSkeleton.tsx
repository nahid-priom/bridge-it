import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function FormSkeleton({
  fields = 6,
  withPreview = false,
  className,
}: {
  fields?: number;
  withPreview?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-6',
        withPreview ? 'lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]' : undefined,
        className
      )}
      aria-busy="true"
      aria-label="Loading form"
    >
      <div className="space-y-5">
        <Skeleton className="h-7 w-48" />
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2" aria-hidden>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" rounded="xl" />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-28" rounded="xl" />
          <Skeleton className="h-10 w-24" rounded="xl" />
        </div>
      </div>
      {withPreview ? (
        <div className="space-y-3" aria-hidden>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="aspect-[16/10] w-full" rounded="2xl" />
        </div>
      ) : null}
    </div>
  );
}
