import { cn } from '@/lib/cn';
import type { CatalogCategoryRoot, CatalogIndustry } from '../types';
import { IndustryCard } from './IndustryCard';

export function IndustryGrid({
  industries,
  root,
  className,
}: {
  industries: CatalogIndustry[];
  root: CatalogCategoryRoot;
  className?: string;
}) {
  if (industries.length === 0) return null;

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {industries.map((industry) => (
        <IndustryCard key={industry.id} industry={industry} root={root} />
      ))}
    </div>
  );
}
