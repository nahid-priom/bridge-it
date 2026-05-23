'use client';

import { Star } from 'lucide-react';
import { BridgeImage } from '@/components/ui/BridgeImage';
import type { PromotedServiceAd } from '@/data/heroContent';

interface PromotedServiceCardProps {
  ad: PromotedServiceAd;
  onClick: () => void;
  priority?: boolean;
}

export function PromotedServiceCard({ ad, onClick, priority = false }: PromotedServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left bg-white dark:bg-surface rounded-2xl border border-slate-200/80 dark:border-border-subtle shadow-[0_16px_40px_rgba(15,14,23,0.08)] hover:shadow-[0_20px_48px_rgba(15,14,23,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40"
    >
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <BridgeImage
          src={ad.image}
          alt={ad.title}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 85vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: `${ad.statusColor}E6` }}
        >
          {ad.statusBadge}
        </div>
        <div
          className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[9px] font-semibold text-white bg-gradient-to-r ${ad.categoryGradient}`}
        >
          {ad.categoryBadge}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-text-primary line-clamp-1 mb-1">
          {ad.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-text-muted line-clamp-2 mb-3 min-h-[2.5rem]">
          {ad.description}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-text-primary">
              {ad.rating}
            </span>
            <span className="text-xs text-slate-400 dark:text-text-muted">
              ({ad.reviewCount})
            </span>
          </div>
          <span className="text-xs font-bold text-bridge-primary">{ad.priceLabel}</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-text-muted mt-2">by {ad.seller}</p>
      </div>
    </button>
  );
}
