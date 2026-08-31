'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, ArrowRight } from 'lucide-react';
import type { BitpPortfolioItem } from '@/types/bitp';
import { ROUTES } from '@/lib/routes';

type FeaturedPortfolioSectionProps = {
  items?: BitpPortfolioItem[];
};

export function FeaturedPortfolioSection({ items = [] }: FeaturedPortfolioSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-surface" aria-labelledby="portfolio-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 id="portfolio-heading" className="text-2xl md:text-3xl font-black font-display text-text-primary">
              Featured Projects
            </h2>
            <p className="text-sm text-text-secondary mt-2">Real work delivered for growing businesses.</p>
          </div>
          <Link href={ROUTES.portfolio} className="inline-flex items-center gap-2 text-sm font-bold text-deshi-green hover:underline">
            View All Projects
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 mx-auto text-text-secondary/40 mb-3" aria-hidden />
            <p className="text-sm text-text-secondary">Featured projects will appear here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-deshi-green/40 transition-colors">
                <div className="relative aspect-video bg-gradient-to-br from-emerald-600/20 to-teal-700/20">
                  {item.thumbnail && <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />}
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{item.title}</h3>
                  {item.client_name && <p className="text-sm text-text-secondary">{item.client_name}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** @deprecated */
export function TopRatedFreelancers() {
  return <FeaturedPortfolioSection />;
}
