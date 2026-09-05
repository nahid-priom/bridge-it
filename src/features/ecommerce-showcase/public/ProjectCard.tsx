'use client';

import {
  PortfolioCard,
  normalizeWebsiteProject,
} from '@/src/features/catalog/components/portfolio-card';
import type { EcommerceProjectCard } from '../types';

export function ProjectCard({
  project,
  eager = false,
  priority = false,
  variant = 'default',
}: {
  project: EcommerceProjectCard;
  eager?: boolean;
  priority?: boolean;
  /** @deprecated Unified PortfolioCard — variant ignored. */
  variant?: 'default' | 'home';
}) {
  void variant;
  return (
    <PortfolioCard data={normalizeWebsiteProject(project)} eager={eager} priority={priority} />
  );
}

export { ProjectCardSkeleton } from '@/src/components/skeletons/ProjectCardSkeleton';
