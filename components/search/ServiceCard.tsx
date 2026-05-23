'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MarketplaceService } from '@/types/marketplace';
import { getMarketplaceThumbnailStyle } from '@/lib/marketplace/thumbnails';
import { SellerAvatar } from '@/components/search/SellerAvatar';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';

type ServiceCardProps = {
  service: MarketplaceService;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export const ServiceCard = memo(function ServiceCard({
  service,
  isFavorite,
  onToggleFavorite,
}: ServiceCardProps) {
  const serviceHref = `${ROUTES.products}/${service.slug}`;
  const sellerHref = service.sellerSlug
    ? ROUTES.marketplaceSeller(service.sellerSlug)
    : null;
  const thumb = getMarketplaceThumbnailStyle(service.categorySlug, service.rowGroup);
  const displayRating = service.sellerRating ?? service.rating;

  return (
    <motion.article
      layout
      className="group h-full flex flex-col rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-deshi-green/10 hover:border-deshi-green/30 transition-all duration-300"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={serviceHref}
        className="relative aspect-[16/10] overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50 focus-visible:ring-inset"
      >
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105',
            thumb.className
          )}
        >
          {service.thumbnailType === 'image' && service.thumbnailUrl ? (
            <Image src={service.thumbnailUrl} alt="" fill className="object-cover" sizes="320px" />
          ) : (
            <span className="text-4xl drop-shadow-md" aria-hidden>
              {thumb.icon}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(service.id);
          }}
          className={cn(
            'absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center',
            'bg-white/95 dark:bg-slate-900/90 shadow-md border border-slate-200/80 dark:border-white/10',
            'hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50'
          )}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isFavorite}
        >
          <Heart
            className={cn(
              'w-4 h-4',
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'
            )}
          />
        </button>
      </Link>

      <div className="flex flex-col flex-1 p-3.5 md:p-4">
        {sellerHref ? (
          <Link
            href={sellerHref}
            className="flex items-center gap-2 mb-2.5 rounded-lg -mx-1 px-1 py-0.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40"
          >
            {service.sellerAvatarUrl ? (
              <Image
                src={service.sellerAvatarUrl}
                alt=""
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0"
              />
            ) : (
              <SellerAvatar name={service.sellerName} size="sm" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-primary truncate group-hover:text-deshi-green">
                {service.sellerName}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {service.sellerLevel}
                {service.sellerCity ? ` · ${service.sellerCity}` : ''}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 mb-2.5">
            <SellerAvatar name={service.sellerName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-primary truncate">{service.sellerName}</p>
              <p className="text-[10px] text-text-muted truncate">{service.sellerLevel}</p>
            </div>
          </div>
        )}

        <Link
          href={serviceHref}
          className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/40 rounded-lg"
        >
          <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug mb-2 group-hover:text-deshi-green transition-colors">
            {service.title}
          </h3>

          <div className="flex items-center gap-1 text-xs mb-3">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" aria-hidden />
            <span className="font-bold text-text-primary">{displayRating.toFixed(1)}</span>
            <span className="text-text-muted">({service.reviewCount})</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wide">From</p>
              <p className="text-base font-black text-text-primary leading-none">
                ৳{service.priceFrom.toLocaleString('en-BD')}
              </p>
            </div>
            {service.deliveryDays != null && (
              <p className="text-[11px] font-medium text-text-muted whitespace-nowrap">
                {service.deliveryDays} Days Delivery
              </p>
            )}
          </div>
        </Link>
      </div>
    </motion.article>
  );
});
