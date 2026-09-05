'use client';

import {
  PortfolioCard,
  PortfolioCardSkeleton,
  normalizeSoftwareProject,
  softwareDetailUrl,
} from '@/src/features/catalog/components/portfolio-card';
import type { SoftwareProjectCard } from '../types';

export { softwareDetailUrl };

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
