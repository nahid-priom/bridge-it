import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import type { MarketplaceService } from '@/types/marketplace';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/cn';
import { formatBdtPrice, formatDeliveryDays } from '@/lib/marketplace/format';
import { hasValidSolutionCover } from '@/lib/solutions/isLegacyCover';
import { SolutionCoverImage } from '@/components/solutions/SolutionCoverImage';

function getServiceBadge(service: MarketplaceService): string | null {
  if (service.isFeatured) return 'Featured';
  if (service.isPopular) return 'Popular';
  if (service.rating >= 4.9) return 'Top Rated';
  return null;
}

type MarketplaceServiceCardProps = {
  service: MarketplaceService;
  className?: string;
};

export function MarketplaceServiceCard({ service, className }: MarketplaceServiceCardProps) {
  const badge = getServiceBadge(service);
  const href = ROUTES.service(service.slug);
  const hasCover =
    service.thumbnailType === 'image' &&
    hasValidSolutionCover(service.thumbnailUrl, service.coverImagePath);
  const coverAlt =
    service.coverImageAlt ??
    `3D illustration of ${service.title} for ${service.categoryName}`;

  return (
    <article
      className={cn(
        'group flex flex-col h-full rounded-2xl border border-slate-200/80 dark:border-white/10',
        'bg-white dark:bg-[#0f1424] shadow-sm',
        'hover:shadow-lg hover:shadow-deshi-green/10 hover:border-deshi-green/35',
        'hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
    >
      <Link
        href={href}
        className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-deshi-green/50 rounded-2xl"
        aria-label={`View ${service.title} by ${service.sellerName}`}
      >
        <SolutionCoverImage
          src={hasCover ? service.thumbnailUrl : null}
          alt={coverAlt}
          categorySlug={service.categorySlug}
          aspectClassName="aspect-[16/9]"
          sizes="(max-width: 640px) 260px, 280px"
          imageClassName="group-hover:scale-105 transition-transform duration-500"
          badge={
            badge ? (
              <span
                className={cn(
                  'absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide text-white',
                  badge === 'Featured' && 'bg-deshi-purple',
                  badge === 'Popular' && 'bg-deshi-green',
                  badge === 'Top Rated' && 'bg-amber-500'
                )}
              >
                {badge}
              </span>
            ) : undefined
          }
        />

        <div className="flex flex-col flex-1 p-3.5 sm:p-4">
          <p className="text-[11px] font-semibold text-deshi-green truncate mb-1">
            {service.categoryName}
          </p>
          <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-deshi-green transition-colors mb-2 min-h-[2.5rem]">
            {service.title}
          </h3>

          <p className="text-xs text-text-secondary truncate mb-2">{service.sellerName}</p>

          <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
            <span className="inline-flex items-center gap-0.5 font-semibold text-text-primary">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden />
              {service.rating.toFixed(1)}
            </span>
            <span>({service.reviewCount})</span>
            <span className="text-border-subtle">·</span>
            <span className="inline-flex items-center gap-0.5 truncate">
              <Clock className="w-3 h-3 shrink-0" aria-hidden />
              {formatDeliveryDays(service.deliveryDays)}
            </span>
          </div>

          <div className="mt-auto pt-2.5 border-t border-slate-100 dark:border-white/10">
            <p className="text-[11px] text-text-muted mb-0.5">From</p>
            <p className="text-base font-black text-text-primary">
              {formatBdtPrice(service.priceFrom)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
