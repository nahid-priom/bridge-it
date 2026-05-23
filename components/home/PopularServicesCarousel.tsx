'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Category, Service } from '@/types';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { ROUTES } from '@/lib/routes';
import {
  ServiceMarketplaceCard,
  getCategoryLabel,
} from '@/components/home/ServiceMarketplaceCard';
import { HOME_SECTION_IDS } from '@/data/homeContent';

type PopularServicesCarouselProps = {
  services: Service[];
  categories: Category[];
};

export function PopularServicesCarousel({
  services,
  categories,
}: PopularServicesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { goToService } = useAppNavigation();

  const scroll = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-carousel-card]') as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 280) + 16), behavior: 'smooth' });
  }, []);

  if (services.length === 0) return null;

  return (
    <section
      id={HOME_SECTION_IDS.popular}
      className="py-12 md:py-16 bg-deshi-mint/30 dark:bg-deshi-navy/20"
      aria-labelledby="popular-services-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2
              id="popular-services-heading"
              className="text-2xl md:text-3xl font-black font-display text-text-primary"
            >
              Popular Services
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Most in-demand services loved by our clients
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-surface flex items-center justify-center hover:border-deshi-green/40 transition-colors"
              aria-label="Previous services"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-surface flex items-center justify-center hover:border-deshi-green/40 transition-colors"
              aria-label="Next services"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href={ROUTES.search}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-deshi-green ml-2"
            >
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 scrollbar-none"
          role="list"
        >
          {services.map((service) => (
            <div
              key={service.id}
              data-carousel-card
              role="listitem"
              className="snap-start shrink-0 w-[min(100%,280px)] sm:w-[300px]"
            >
              <ServiceMarketplaceCard
                service={service}
                categoryLabel={getCategoryLabel(categories, service.category)}
                onSelect={goToService}
                compact
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
