'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
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
  const outcome =
    project.feature_summary ?? project.short_description ?? project.industry ?? project.business_type;
  const features = project.primary_features?.slice(0, 3) ?? [];
  const ratingFallback = fallbackRatingFromSlug(project.slug);
  const ratingAvg = project.rating_avg ?? ratingFallback.rating_avg;
  const reviewCount = project.review_count ?? ratingFallback.review_count;
  const elaboration = cardElaboration(project.feature_summary ?? project.short_description, {
    fallback: 'Business-ready software solution',
  });

  const prefetchDetail = () => {
    router.prefetch(href);
  };

  if (variant === 'home') {
    return (
      <article
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle/90 bg-surface',
          'shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
          'transition-[transform,border-color,box-shadow] duration-300 ease-out',
          'hover:-translate-y-0.5 hover:border-[#2563eb]/45',
          'hover:shadow-[0_10px_24px_-14px_rgba(37,99,235,0.4)]',
          'active:opacity-90',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        )}
      >
        <Link
          href={href}
          prefetch={false}
          onMouseEnter={prefetchDetail}
          onFocus={prefetchDetail}
          className={cn('flex h-full flex-col outline-none', focusVisibleRing)}
          aria-label={`View ${project.title}`}
        >
          <div className="relative overflow-hidden rounded-t-xl">
            {project.featured ? <FeaturedBadge /> : null}
            <CatalogCoverImage
              src={project.coverImageUrl}
              alt={`${project.title} project preview`}
              emptyTitle={project.title}
              eager={loadEager}
              priority={priority}
              fit="contain"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 320px) 50vw, 100vw"
              className="w-full"
              imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface/70 to-transparent"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1 border-t border-border-subtle/70 px-2.5 py-2 sm:gap-1.5 sm:px-3 sm:py-2.5">
            <div className="flex min-h-[2.5em] items-center">
              <h4 className="font-display text-[0.8125rem] font-bold leading-[1.25] tracking-[-0.02em] text-text-primary line-clamp-2 sm:text-sm">
                {project.title}
              </h4>
            </div>
            <StarRating rating={ratingAvg} reviewCount={reviewCount} size="xs" />
            <p className="min-h-[2.5em] text-[0.6875rem] leading-[1.25] text-text-secondary line-clamp-2 sm:text-xs">
              {elaboration}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <Link
        href={href}
        className="relative block overflow-hidden bg-background-soft"
        prefetch={false}
        onMouseEnter={prefetchDetail}
        onFocus={prefetchDetail}
      >
        {project.featured ? <FeaturedBadge /> : null}
        <CatalogCoverImage
          src={project.coverImageUrl}
          alt={`${project.title} project preview`}
          emptyTitle={project.title}
          eager={loadEager}
          priority={priority}
          fit="contain"
          className="h-full w-full"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb]">
            {categoryLabel}
          </p>
          <h4 className="mt-1 font-display text-lg font-bold leading-snug text-text-primary">
            <Link
              href={href}
              className="hover:text-[#2563eb]"
              prefetch={false}
              onMouseEnter={prefetchDetail}
              onFocus={prefetchDetail}
            >
              {project.title}
            </Link>
          </h4>
          <StarRating rating={ratingAvg} reviewCount={reviewCount} className="mt-1.5" />
          {outcome ? <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{outcome}</p> : null}
        </div>
        {features.length > 0 ? (
          <ul className="mt-1 space-y-1.5">
            {features.map((feature) => (
              <li key={feature.id} className="flex items-start gap-2 text-sm text-text-secondary">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2563eb]" aria-hidden />
                <span className="line-clamp-1">{feature.title}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          {project.starting_price != null && project.starting_price > 0 ? (
            <p className="text-sm text-text-secondary">
              Starting from{' '}
              <span className="font-semibold text-text-primary">
                {formatCatalogPrice(project.starting_price, {
                  suffix: project.price_suffix,
                  currency: project.currency ?? 'BDT',
                })}
              </span>
            </p>
          ) : (
            <span />
          )}
          <Link
            href={href}
            prefetch={false}
            onMouseEnter={prefetchDetail}
            onFocus={prefetchDetail}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold',
              'bg-[#2563eb] text-white transition-colors hover:bg-[#1d4ed8]'
            )}
          >
            View Software
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function SoftwareCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface"
    >
      <div className="aspect-card w-full animate-pulse bg-background-soft" />
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-background-soft" />
        <div className="mt-1 h-5 w-3/4 animate-pulse rounded bg-background-soft" />
        <div className="h-4 w-full animate-pulse rounded bg-background-soft" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-background-soft" />
        <div className="h-3 w-4/6 animate-pulse rounded bg-background-soft" />
        <div className="mt-auto h-10 w-full animate-pulse rounded-xl bg-background-soft" />
      </div>
    </div>
  );
}
