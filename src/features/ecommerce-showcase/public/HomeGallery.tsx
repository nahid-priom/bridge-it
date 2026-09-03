import Link from 'next/link';
import type { EcommerceProjectCard } from '../types';
import { ProjectGrid } from './ProjectGrid';
import { WebsiteTypeFilters } from './WebsiteTypeFilters';

export function HomeGallery({ projects }: { projects: EcommerceProjectCard[] }) {
  const cards = projects.slice(0, 6);

  return (
    <section className="pb-12 md:pb-14">
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb] dark:text-[#60a5fa]">
              Design Gallery
            </p>
            <h2 className="mt-1 font-display text-2xl font-black text-text-primary md:text-3xl dark:text-white">
              Explore E-commerce Designs
            </h2>
          </div>
          <Link
            href="/websites"
            className="text-sm font-semibold text-[#2563eb] hover:underline dark:text-[#60a5fa]"
          >
            View all websites →
          </Link>
        </div>

        <WebsiteTypeFilters className="mb-6 md:mb-7" />

        <ProjectGrid
          projects={cards}
          eagerCount={0}
          priorityFirst={false}
          variant="home"
          columns="home"
          emptyTitle="No website designs yet"
          emptyDescription="Published e-commerce projects will appear here."
          emptyActionHref="/websites"
          emptyActionLabel="Browse websites"
        />
      </div>
    </section>
  );
}
