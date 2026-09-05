'use client';

import {
  PortfolioCard,
  PortfolioCardSkeleton,
  normalizeMarketingProject,
  creativeDetailUrl,
} from '@/src/features/catalog/components/portfolio-card';
import type { CreativeMarketingProjectCard } from '../types';

export { creativeDetailUrl };

export function CreativeMarketingCard({
  project,
  eager = false,
  priority = false,
  variant = 'default',
}: {
  project: CreativeMarketingProjectCard;
  eager?: boolean;
  priority?: boolean;
  /** @deprecated Unified PortfolioCard — variant ignored. */
  variant?: 'default' | 'home';
}) {
  void variant;
  return (
    <PortfolioCard data={normalizeMarketingProject(project)} eager={eager} priority={priority} />
  );
}

export function CreativeMarketingCardSkeleton() {
  return <PortfolioCardSkeleton />;
}
