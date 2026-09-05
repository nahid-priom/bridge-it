'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bookmark, Star } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { CatalogCoverImage } from '@/src/features/catalog/components/CatalogCoverImage';
import { formatPortfolioPriceLabel } from './format-portfolio-price';
import type { PortfolioCardData } from './types';

function CompactRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount?: number | null;
}) {
  const safe = Math.max(0, Math.min(5, rating));
  const label =
    typeof reviewCount === 'number' && reviewCount > 0
      ? `${safe.toFixed(1)} out of 5 from ${reviewCount} reviews`
      : `${safe.toFixed(1)} out of 5`;

  return (
    <p className="inline-flex min-w-0 items-center gap-1 text-xs text-text-secondary sm:text-sm" title={label}>
      <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
      <span className="font-semibold tabular-nums text-text-primary">{safe.toFixed(1)}</span>
      {typeof reviewCount === 'number' && reviewCount > 0 ? (
        <span className="text-text-muted">({reviewCount})</span>
      ) : null}
      <span className="sr-only">{label}</span>
    </p>
  );
}

export function PortfolioCard({
  data,
  eager = false,
  priority = false,
  className,
}: {
  data: PortfolioCardData;
  eager?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const loadEager = eager || priority;
  const priceLabel = formatPortfolioPriceLabel(data);
  const hasRating = data.rating != null && data.rating > 0;

  const prefetchDetail = () => {
    router.prefetch(data.href);
  };

  return (
    <article
      className={cn(
        'group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface sm:rounded-2xl',
        'transition-[transform,border-color] duration-200 ease-out',
        'hover:-translate-y-0.5 hover:border-bridge-primary/40',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className
      )}
    >
      <Link
        href={data.href}
        prefetch={false}
        onMouseEnter={prefetchDetail}
        onFocus={prefetchDetail}
        className={cn('flex h-full min-w-0 flex-col outline-none', focusVisibleRing)}
        aria-label={`View ${data.title}`}
      >
        <div className="relative min-w-0 overflow-hidden bg-background-soft">
          {data.featured ? (
            <span
              className="absolute top-2 right-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f2744]/75 text-white backdrop-blur-[2px]"
              aria-label="Featured"
            >
              <Bookmark className="h-4 w-4 fill-white text-white" aria-hidden />
            </span>
          ) : null}
          <CatalogCoverImage
            src={data.coverImageUrl}
            fallbackSrc={data.coverImageFallbackUrl}
            alt={data.coverImageAlt ?? `${data.title} preview`}
            emptyTitle={data.title}
            eager={loadEager}
            priority={priority}
            fit="cover"
            width={800}
            height={600}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 320px) 50vw, 100vw"
            className="aspect-[4/3] w-full"
            imgClassName="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 border-t border-border-subtle/70 px-3 py-2.5 sm:px-3.5 sm:py-3">
          {data.categoryLabel ? (
            <p className="truncate text-[0.625rem] font-bold uppercase tracking-wider text-bridge-primary sm:text-[0.6875rem]">
              {data.categoryLabel}
            </p>
          ) : null}

          <h3 className="min-w-0 font-display text-base font-bold leading-snug tracking-[-0.02em] text-text-primary line-clamp-2 sm:text-lg">
            {data.title}
          </h3>

          {hasRating ? (
            <CompactRating rating={data.rating!} reviewCount={data.reviewCount} />
          ) : null}

          {priceLabel ? (
            <p className="mt-auto pt-1 text-base font-semibold tabular-nums text-text-primary sm:text-lg">
              {priceLabel}
              <span
                aria-hidden
                className="ml-1 inline-block text-sm font-medium text-bridge-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:hidden"
              >
                →
              </span>
            </p>
          ) : (
            <span
              aria-hidden
              className="mt-auto pt-1 text-sm font-medium text-bridge-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:hidden"
            >
              View details →
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}

export function PortfolioCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface sm:rounded-2xl',
        className
      )}
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-background-soft" />
      <div className="flex flex-1 flex-col gap-1.5 border-t border-border-subtle/70 px-3 py-2.5">
        <div className="h-3 w-16 animate-pulse rounded bg-background-soft" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-background-soft" />
        <div className="h-3.5 w-20 animate-pulse rounded bg-background-soft" />
        <div className="mt-1 h-5 w-24 animate-pulse rounded bg-background-soft" />
      </div>
    </div>
  );
}
