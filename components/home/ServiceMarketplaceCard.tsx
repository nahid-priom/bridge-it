'use client';

import Image from 'next/image';
import { Star, Clock } from 'lucide-react';
import type { Service } from '@/types';
import type { Category } from '@/types';
import { cn } from '@/lib/cn';

type ServiceMarketplaceCardProps = {
  service: Service;
  categoryLabel?: string;
  onSelect: (service: Service) => void;
  className?: string;
  compact?: boolean;
};

export function ServiceMarketplaceCard({
  service,
  categoryLabel,
  onSelect,
  className,
  compact = false,
}: ServiceMarketplaceCardProps) {
  const categoryName = categoryLabel ?? service.subcategory;

  return (
    <article
      className={cn(
        'group flex flex-col h-full rounded-2xl border border-border-subtle bg-surface overflow-hidden',
        'shadow-sm hover:shadow-lg hover:shadow-deshi-green/10 hover:border-deshi-green/30',
        'transition-all duration-300',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(service)}
        className="text-left flex flex-col h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-primary/40 focus-visible:ring-inset"
        aria-label={`View ${service.title} by ${service.sellerName}`}
      >
        <div className={cn('relative overflow-hidden bg-background-soft', compact ? 'aspect-[16/10]' : 'aspect-[16/11]')}>
          <Image
            src={service.thumbnail}
            alt=""
            fill
            sizes="(max-width: 640px) 280px, 320px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {service.popular && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-bridge-accent text-white text-[10px] font-bold uppercase tracking-wide">
              Popular
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4">
          <p className="text-[11px] font-medium text-deshi-green truncate mb-1">{categoryName}</p>
          <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-bridge-primary-light transition-colors mb-2">
            {service.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <Image
              src={service.sellerAvatar}
              alt=""
              width={24}
              height={24}
              className="rounded-full object-cover border border-border-subtle"
            />
            <span className="text-xs text-text-secondary truncate">{service.sellerName}</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-0.5 font-semibold text-text-primary">
                <Star className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" aria-hidden />
                {service.rating}
              </span>
              <span>({service.reviewCount})</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-text-muted uppercase tracking-wide">From</p>
              <p className="text-sm font-black text-text-primary leading-none">
                ৳{service.price.toLocaleString('en-BD')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2 text-[11px] text-text-muted">
            <Clock className="w-3 h-3 shrink-0" aria-hidden />
            <span>{service.deliveryTime}</span>
          </div>
        </div>
      </button>
    </article>
  );
}

export function getCategoryLabel(categories: Category[], categoryId: string): string | undefined {
  return categories.find((c) => c.id === categoryId)?.name;
}
