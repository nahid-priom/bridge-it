import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className={CATALOG_LISTING_GRID_CLASS}
      aria-busy="true"
      aria-label="Loading projects"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}
