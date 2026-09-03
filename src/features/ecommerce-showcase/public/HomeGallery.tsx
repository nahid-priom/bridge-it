import Link from 'next/link';
import { Suspense } from 'react';
import type { EcommerceProjectCard } from '../types';
import { PageFilter } from './PageFilter';
import { ProjectGrid } from './ProjectGrid';

export function HomeGallery({ projects }: { projects: EcommerceProjectCard[] }) {
  const featured = projects.filter((item) => item.featured);
  const rest = projects.filter((item) => !item.featured);

  return (
    <section className="pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Design Gallery</p>
            <h2 className="font-display text-2xl md:text-3xl font-black text-[#0f2744] dark:text-white mt-1">
              Explore E-commerce Designs
            </h2>
          </div>
          <Link href="/websites" className="text-sm font-semibold text-emerald-700 hover:underline">
            View all websites
          </Link>
        </div>
        <Suspense fallback={null}>
          <PageFilter className="mb-8" basePath="/websites" />
        </Suspense>
        {featured.length > 0 ? (
          <div className="mb-10">
            <h3 className="font-display text-lg font-bold mb-4">Featured Designs</h3>
            <ProjectGrid projects={featured.slice(0, 4)} eagerCount={4} priorityFirst />
          </div>
        ) : null}
        {rest.length > 0 ? (
          <ProjectGrid
            projects={rest}
            eagerCount={featured.length > 0 ? 0 : 4}
            priorityFirst={featured.length === 0}
          />
        ) : featured.length === 0 ? (
          <ProjectGrid projects={[]} />
        ) : null}
      </div>
    </section>
  );
}
