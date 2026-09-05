'use client';

import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { SoftwareCard } from './SoftwareCard';
import type { SoftwareProjectCard } from '../types';

/** Related software rail — unified PortfolioCard via SoftwareCard adapter. */
export function RelatedSoftware({
  projects,
  title = 'Related Software',
}: {
  projects: SoftwareProjectCard[];
  title?: string;
}) {
  if (projects.length === 0) return null;
  return (
    <section
      className="mx-auto mt-10 w-full max-w-[1480px] px-4 lg:mt-14 sm:px-6 lg:px-8 xl:px-10"
      aria-labelledby="related-software-heading"
    >
      <h2
        id="related-software-heading"
        className="mb-1 font-display text-xl font-black text-text-primary md:text-2xl"
      >
        {title}
      </h2>
      <ul className={`mt-4 ${CATALOG_LISTING_GRID_CLASS}`}>
        {projects.slice(0, 4).map((project, index) => (
          <li key={project.id} className="min-w-0 list-none">
            <SoftwareCard project={project} eager={index < 2} />
          </li>
        ))}
      </ul>
    </section>
  );
}
