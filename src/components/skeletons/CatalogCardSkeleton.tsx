import { cn } from '@/lib/cn';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { PortfolioCardSkeleton } from '@/src/features/catalog/components/portfolio-card';

/** Matches unified PortfolioCard listing layout. */
export function CatalogCardSkeleton({ className }: { className?: string }) {
  return <PortfolioCardSkeleton className={className} />;
}

export function CatalogGridSkeleton({
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
      aria-label="Loading catalog"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className={cn('min-w-0 list-none', index >= 3 && 'max-md:hidden')}>
          <CatalogCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
