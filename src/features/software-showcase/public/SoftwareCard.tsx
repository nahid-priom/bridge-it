'use client';

import { ROUTES } from '@/lib/routes';
import { softwareIndustryForProduct } from '@/src/features/catalog/config/software-industry-map';
import {
  PortfolioCard,
  PortfolioCardSkeleton,
  normalizeSoftwareProject,
} from '@/src/features/catalog/components/portfolio-card';
import type { SoftwareProjectCard } from '../types';

export function softwareDetailUrl(
  slug: string,
  industrySlug?: string | null,
  canonicalPath?: string | null
): string {
  if (canonicalPath?.trim()) return canonicalPath.trim();
  const industry = industrySlug?.trim() || softwareIndustryForProduct(slug);
  if (industry) return ROUTES.softwareProduct(industry, slug);
  return ROUTES.softwareSolution(slug);
}

export function SoftwareCard({
  project,
  eager = false,
  priority = false,
  variant = 'default',
}: {
  project: SoftwareProjectCard;
  eager?: boolean;
  priority?: boolean;
  /** @deprecated Unified PortfolioCard — variant ignored. */
  variant?: 'default' | 'home';
}) {
  void variant;
  return (
    <PortfolioCard data={normalizeSoftwareProject(project)} eager={eager} priority={priority} />
  );
}

export function SoftwareCardSkeleton() {
  return <PortfolioCardSkeleton />;
}
