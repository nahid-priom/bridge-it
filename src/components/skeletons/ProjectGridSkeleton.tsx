import { cn } from '@/lib/cn';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

export function ProjectGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(CATALOG_LISTING_GRID_CLASS, className)}
      aria-busy="true"
      aria-label="Loading projects"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={index >= 4 ? 'max-md:hidden' : undefined}>
          <ProjectCardSkeleton />
        </div>
      ))}
    </div>
  );
}
