import { cn } from '@/lib/cn';
import { PortfolioCardSkeleton } from '@/src/features/catalog/components/portfolio-card';

/** Matches unified PortfolioCard layout for minimal CLS. */
export function ProjectCardSkeleton({ className }: { className?: string }) {
  return <PortfolioCardSkeleton className={className} />;
}
