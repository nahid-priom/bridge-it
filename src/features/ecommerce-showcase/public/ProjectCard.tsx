'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { FeaturedBadge } from '@/src/features/catalog/components/FeaturedBadge';
import { StarRating } from '@/src/features/catalog/components/StarRating';
import { fallbackRatingFromSlug } from '@/src/features/catalog/types/reviews';
import { cardElaboration } from '@/src/features/catalog/utils/card-elaboration';
import type { EcommerceProjectCard } from '../types';
import { websiteDetailUrl } from '../utils/filters';
import { CatalogCoverImage } from '@/src/features/catalog/components/CatalogCoverImage';

const HOME_SIZES =
  '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 320px) 50vw, 100vw';

export function ProjectCard({
  project,
  eager = false,
  priority = false,
  variant = 'default',
}: {
  project: EcommerceProjectCard;
  eager?: boolean;
  priority?: boolean;
  variant?: 'default' | 'home';
}) {
  const router = useRouter();
  const href = websiteDetailUrl(project.slug, project.industry_slug, project.canonical_path);
  const categoryLabel =
    project.industry_name ?? project.category_name ?? project.industry ?? 'E-commerce';
  const ratingFallback = fallbackRatingFromSlug(project.slug);
  const ratingAvg = project.rating_avg ?? ratingFallback.rating_avg;
  const reviewCount = project.review_count ?? ratingFallback.review_count;
  const elaboration = cardElaboration(project.short_description, {
    fallback: 'Ready-made storefront website template',
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
          <div className="relative aspect-card overflow-hidden rounded-t-xl bg-background-soft">
            {project.featured ? <FeaturedBadge /> : null}
            <CatalogCoverImage
              src={project.coverImageUrl}
              fallbackSrc={project.coverImageFallbackUrl}
              alt={`${project.title} project preview`}
              emptyTitle={project.title}
              width={800}
              height={600}
              eager={eager || priority}
              priority={priority}
              fit="cover"
              className="h-full w-full"
              imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              sizes={HOME_SIZES}
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
        className="relative block aspect-card overflow-hidden bg-background-soft"
        prefetch={false}
        onMouseEnter={prefetchDetail}
        onFocus={prefetchDetail}
      >
        {project.featured ? <FeaturedBadge /> : null}
        <CatalogCoverImage
          src={project.coverImageUrl}
          fallbackSrc={project.coverImageFallbackUrl}
          alt={`${project.title} project preview`}
          emptyTitle={project.title}
          width={800}
          height={600}
          eager={eager || priority}
          priority={priority}
          fit="cover"
          className="h-full w-full"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb]">
            {categoryLabel}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug text-text-primary">
            <Link
              href={href}
              className="hover:text-[#2563eb]"
              prefetch={false}
              onMouseEnter={prefetchDetail}
              onFocus={prefetchDetail}
            >
              {project.title}
            </Link>
          </h3>
          <StarRating rating={ratingAvg} reviewCount={reviewCount} className="mt-1.5" />
          {project.short_description ? (
            <p className="mt-1.5 line-clamp-1 text-sm text-text-secondary">{project.short_description}</p>
          ) : null}
        </div>
        <Link
          href={href}
          prefetch={false}
          onMouseEnter={prefetchDetail}
          onFocus={prefetchDetail}
          className={cn(
            'mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold',
            'bg-[#2563eb] text-white transition-colors hover:bg-[#1d4ed8]'
          )}
        >
          View Template
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export { ProjectCardSkeleton } from '@/src/components/skeletons/ProjectCardSkeleton';
