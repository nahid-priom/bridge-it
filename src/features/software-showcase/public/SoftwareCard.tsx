'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import { FeaturedBadge } from '@/src/features/catalog/components/FeaturedBadge';
import { StarRating } from '@/src/features/catalog/components/StarRating';
import { fallbackRatingFromSlug } from '@/src/features/catalog/types/reviews';
import { softwareIndustryForProduct } from '@/src/features/catalog/config/software-industry-map';
import { cardElaboration } from '@/src/features/catalog/utils/card-elaboration';
import type { SoftwareProjectCard } from '../types';
import { CatalogCoverImage } from '@/src/features/catalog/components/CatalogCoverImage';

export function softwareDetailUrl(
  slug: string,
  industrySlug?: string | null,
  canonicalPath?: string | null
): string {
  if (canonicalPath?.trim()) return canonicalPath.trim();
  const industry = industrySlug?.trim() || softwareIndustryForProduct(slug);
  if (industry) return ROUTES.softwareProduct(industry, slug);
  return ROUTES.softwareSolution(slug);
}

function startingPriceLabel(project: SoftwareProjectCard): number {
  const price = Number(project.starting_price ?? 0);
  return Math.max(price, 10000);
}

export function SoftwareCard({
  project,
  eager = false,
  priority = false,
  variant = 'default',
}: {
  project: SoftwareProjectCard;
  eager?: boolean;
  priority?: boolean;
  variant?: 'default' | 'home';
}) {
  const router = useRouter();
  const href = softwareDetailUrl(project.slug, project.industry_slug, project.canonical_path);
  const loadEager = eager || priority;
  const categoryLabel =
    project.industry_name ??
    project.taxonomy_category_name ??
    project.child_category_name ??
    project.category_name ??
    'Software';
  const ratingFallback = fallbackRatingFromSlug(project.slug);
  const ratingAvg = project.rating_avg ?? ratingFallback.rating_avg;
  const reviewCount = project.review_count ?? ratingFallback.review_count;
  const elaboration = cardElaboration(project.feature_summary ?? project.short_description, {
    fallback: 'Business-ready software solution',
  });
  const price = startingPriceLabel(project);

  const prefetchDetail = () => {
    router.prefetch(href);
  };

  return (
    <article
      className={cn(
        'group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface',
        'transition-[transform,border-color,box-shadow] duration-300 ease-out',
        'hover:-translate-y-0.5 hover:border-bridge-primary/40',
        'hover:shadow-[0_10px_24px_-14px_rgba(37,99,235,0.35)]',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        variant === 'home' && 'rounded-xl'
      )}
    >
      <Link
        href={href}
        prefetch={false}
        onMouseEnter={prefetchDetail}
        onFocus={prefetchDetail}
        className={cn('flex h-full min-w-0 flex-col outline-none', focusVisibleRing)}
        aria-label={`View ${project.title}`}
      >
        <div className="relative min-w-0 overflow-hidden bg-background-soft">
          {project.featured ? <FeaturedBadge /> : null}
          <CatalogCoverImage
            src={project.coverImageUrl}
            alt={`${project.title} project preview`}
            emptyTitle={project.title}
            eager={loadEager}
            priority={priority}
            fit="cover"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 320px) 50vw, 100vw"
            className="aspect-[4/3] w-full"
            imgClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>

        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col gap-1 border-t border-border-subtle/70',
            variant === 'home' ? 'px-2.5 py-2 sm:px-3 sm:py-2.5' : 'p-3 sm:p-3.5'
          )}
        >
          <p className="truncate text-[0.625rem] font-bold uppercase tracking-wider text-bridge-primary sm:text-[0.6875rem]">
            {categoryLabel}
          </p>
          <h4
            className={cn(
              'min-w-0 font-display font-bold leading-snug tracking-[-0.02em] text-text-primary line-clamp-2',
              variant === 'home'
                ? 'text-[0.8125rem] sm:text-sm'
                : 'text-sm sm:text-base'
            )}
          >
            {project.title}
          </h4>
          <StarRating rating={ratingAvg} reviewCount={reviewCount} size="xs" />
          <p
            className={cn(
              'min-w-0 text-text-secondary line-clamp-2',
              variant === 'home' ? 'text-[0.6875rem] sm:text-xs' : 'text-xs sm:text-sm'
            )}
          >
            {elaboration}
          </p>
          <div className="mt-auto flex min-w-0 flex-col gap-2 pt-2">
            <p className="text-xs text-text-secondary sm:text-sm">
              Starting from{' '}
              <span className="font-semibold tabular-nums text-text-primary">
                {formatCatalogPrice(price, {
                  suffix: project.price_suffix,
                  currency: project.currency ?? 'BDT',
                })}
              </span>
            </p>
            <span
              className={cn(
                'inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-bridge-primary px-3 py-2 text-xs font-semibold text-white sm:text-sm',
                'transition-colors group-hover:bg-bridge-primary-dark'
              )}
            >
              View Details
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function SoftwareCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface"
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-background-soft" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="h-3 w-16 animate-pulse rounded bg-background-soft" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-background-soft" />
        <div className="h-3 w-full animate-pulse rounded bg-background-soft" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-background-soft" />
        <div className="mt-auto h-9 w-full animate-pulse rounded-xl bg-background-soft" />
      </div>
    </div>
  );
}
