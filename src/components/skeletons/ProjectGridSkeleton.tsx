import { cn } from '@/lib/cn';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

export function ProjectGridSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <ul
      className={cn(CATALOG_LISTING_GRID_CLASS, className)}
      aria-busy="true"
      aria-label="Loading projects"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className={cn('min-w-0 list-none', index >= 3 && 'max-md:hidden')}>
          <ProjectCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
