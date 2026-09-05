'use client';

import { SoftwareCard } from './SoftwareCard';
import type { SoftwareProjectCard } from '../types';

/** Same density as homepage software cards. */
const RELATED_HOME_GRID_CLASS =
  'mt-4 grid grid-cols-2 gap-2.5 min-w-0 sm:gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4';

/** Related software rail — homepage-style cards. */
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
      <div className={RELATED_HOME_GRID_CLASS}>
        {projects.slice(0, 4).map((project, index) => (
          <SoftwareCard
            key={project.id}
            project={project}
            variant="home"
            eager={index < 2}
          />
        ))}
      </div>
    </section>
  );
}
