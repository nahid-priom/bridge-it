'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import type { MarketplaceService } from '@/types/marketplace';
import { getMarketplaceThumbnailStyle } from '@/lib/marketplace/thumbnails';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

type SellerServicesProps = {
  services: MarketplaceService[];
  horizontal?: boolean;
};

export function SellerServices({ services, horizontal = true }: SellerServicesProps) {
  if (services.length === 0) {
    return (
      <p className="text-sm text-text-muted py-8 text-center">No services listed yet.</p>
    );
  }

  const grid = horizontal
    ? 'flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin'
    : 'grid grid-cols-1 sm:grid-cols-2 gap-4';

  return (
    <div className={grid}>
      {services.map((service) => {
        const thumb = getMarketplaceThumbnailStyle(service.categorySlug, service.rowGroup);
        return (
          <Link
            key={service.id}
            href={`${ROUTES.products}/${service.slug}`}
            className={cn(
              horizontal && 'snap-start shrink-0 w-[260px] sm:w-[280px]',
              'group rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/80 overflow-hidden shadow-sm hover:shadow-lg hover:border-deshi-green/30 transition-all'
            )}
          >
            <div
              className={cn(
                'aspect-[16/10] flex items-end p-3',
                thumb.className
              )}
            >
              <span className="text-2xl" aria-hidden>{thumb.icon}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-text-primary line-clamp-2 group-hover:text-deshi-green mb-2">
                {service.title}
              </h3>
              <div className="flex items-center justify-between gap-2">
                <p className="text-base font-black text-text-primary">
                  ৳{service.priceFrom.toLocaleString('en-BD')}
                </p>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {service.rating.toFixed(1)}
                </span>
              </div>
              {service.deliveryDays && (
                <p className="text-[11px] text-text-muted mt-1">{service.deliveryDays} days delivery</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
