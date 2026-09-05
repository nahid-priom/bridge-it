'use client';

import { ROUTES } from '@/lib/routes';
import {
  PortfolioCard,
  PortfolioCardSkeleton,
  normalizeMarketingProject,
} from '@/src/features/catalog/components/portfolio-card';
import type { CreativeMarketingProjectCard } from '../types';

export function creativeDetailUrl(
  slug: string,
  industrySlug?: string | null,
  canonicalPath?: string | null
): string {
  if (canonicalPath?.trim()) return canonicalPath.trim();
  if (industrySlug?.trim()) return ROUTES.marketingProduct(industrySlug.trim(), slug);
  return ROUTES.marketingIndustry(slug);
}

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
