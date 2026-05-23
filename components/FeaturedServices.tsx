'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Category, Service } from '@/types';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { ROUTES } from '@/lib/routes';
import {
  ServiceMarketplaceCard,
  getCategoryLabel,
} from '@/components/home/ServiceMarketplaceCard';
import { mergePopularServices } from '@/data/homeContent';

type FeaturedServicesProps = {
  services: Service[];
  categories: Category[];
};

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({
  services,
  categories,
}) => {
  const { goToService } = useAppNavigation();
  const displayServices = mergePopularServices(services, 8);

  if (displayServices.length === 0) return null;

  return (
    <section className="py-10 md:py-16 relative" aria-labelledby="featured-services-heading">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bridge-primary/20 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-gold/10 border border-bridge-gold/20 rounded-full text-bridge-gold text-xs font-semibold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" aria-hidden /> Hand-picked for you
            </span>
            <h2
              id="featured-services-heading"
              className="text-2xl md:text-4xl font-black font-display text-text-primary"
            >
              Featured <span className="gradient-text-gold">Services</span>
            </h2>
            <p className="text-text-muted text-sm mt-1 max-w-lg">
              Premium listings from verified Bangladeshi freelancers — ready to order.
            </p>
          </div>
          <Link
            href={ROUTES.search}
            className="inline-flex items-center gap-1 text-sm font-semibold text-bridge-primary hover:text-bridge-primary-light shrink-0"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {displayServices.slice(0, 8).map((service) => (
            <ServiceMarketplaceCard
              key={service.id}
              service={service}
              categoryLabel={getCategoryLabel(categories, service.category)}
              onSelect={goToService}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
