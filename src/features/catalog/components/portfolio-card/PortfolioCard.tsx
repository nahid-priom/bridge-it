'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bookmark, Star } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { CatalogCoverImage } from '@/src/features/catalog/components/CatalogCoverImage';
import { formatPortfolioPrice } from './format-portfolio-price';
import type { PortfolioCardData } from './types';

/** Keep card blurbs short enough to read fully in ~2 small lines. */
function truncateCardDescription(text: string, maxWords = 12): string {
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return `${words.slice(0, maxWords).join(' ').replace(/[.,;:!?…]+$/u, '')}…`;
}

function PortfolioRating({
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
    <div className="min-w-0 text-right" title={label}>
      <p className="inline-flex items-center justify-end gap-1 text-sm text-text-secondary">
        <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
        <span className="font-semibold tabular-nums text-text-primary">{safe.toFixed(1)}</span>
        {typeof reviewCount === 'number' && reviewCount > 0 ? (
          <span className="text-text-muted">({reviewCount})</span>
        ) : null}
      </p>
      <p className="mt-0.5 text-[0.6875rem] text-text-muted sm:text-xs">Reviews</p>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function PortfolioPrice({
  primary,
  caption,
}: {
  primary: string;
  caption: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-base font-semibold tabular-nums text-text-primary sm:text-lg">{primary}</p>
      <p className="mt-0.5 text-[0.6875rem] text-text-muted sm:text-xs">{caption}</p>
    </div>
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
  const price = formatPortfolioPrice(data);
  const hasRating = data.rating != null && data.rating > 0;
  const description = data.shortDescription?.trim() || null;

  const prefetchDetail = () => {
    router.prefetch(data.href);
  };

  return (
    <article
      className={cn(
        'group flex h-full min-w-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface',
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
            height={500}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-[16/10] w-full"
            imgClassName="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-4 sm:pb-4 sm:pt-3.5">
          {data.categoryLabel ? (
            <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-bridge-primary">
              {data.categoryLabel}
            </p>
          ) : null}

          <h3
            className={cn(
              'min-w-0 font-display text-xl font-bold leading-snug tracking-[-0.02em] text-text-primary line-clamp-2 lg:text-lg xl:text-xl',
              data.categoryLabel ? 'mt-1' : null
            )}
          >
            {data.title}
          </h3>

          {description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-text-secondary">
              {truncateCardDescription(description)}
            </p>
          ) : null}

          {price || hasRating ? (
            <div
              className={cn(
                'mt-auto grid grid-cols-[1fr_auto] items-end gap-3',
                description ? 'pt-4' : 'pt-3.5'
              )}
            >
              {price ? <PortfolioPrice primary={price.primary} caption={price.caption} /> : <span />}
              {hasRating ? (
                <PortfolioRating rating={data.rating!} reviewCount={data.reviewCount} />
              ) : null}
            </div>
          ) : null}
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
        'flex h-full min-w-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface',
        className
      )}
    >
      <div className="aspect-[16/10] w-full animate-pulse bg-background-soft" />
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <div className="h-2.5 w-14 animate-pulse rounded bg-background-soft" />
        <div className="mt-1 h-6 w-3/4 animate-pulse rounded bg-background-soft" />
        <div className="mt-1 h-3.5 w-full animate-pulse rounded bg-background-soft" />
        <div className="mt-0.5 h-3.5 w-2/3 animate-pulse rounded bg-background-soft" />
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="space-y-1">
            <div className="h-5 w-24 animate-pulse rounded bg-background-soft" />
            <div className="h-3 w-16 animate-pulse rounded bg-background-soft" />
          </div>
          <div className="space-y-1 text-right">
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-background-soft" />
            <div className="ml-auto h-3 w-12 animate-pulse rounded bg-background-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}
