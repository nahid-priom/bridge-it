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
import { ShowcaseImage } from './ShowcaseImage';

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
            <ShowcaseImage
              src={project.cover_image_url}
              fallbackSrc={project.cover_fallback_url}
              alt={`${project.title} e-commerce website template`}
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
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-display text-[0.8125rem] font-bold leading-tight tracking-[-0.02em] text-text-primary line-clamp-1 sm:text-sm">
                  {project.title}
                </h4>
                <p className="mt-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-text-muted line-clamp-1">
                  {categoryLabel}
                </p>
              </div>
              <span
                aria-hidden
                className={cn(
                  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8',
                  'border border-border-subtle bg-background-soft text-text-primary',
                  'transition-[transform,background-color,border-color,box-shadow,color] duration-300',
                  'group-hover:translate-x-0.5 group-hover:border-[#2563eb]/55 group-hover:bg-[#2563eb] group-hover:text-white',
                  'group-hover:shadow-[0_0_12px_rgba(37,99,235,0.35)]',
                  'motion-reduce:transition-none motion-reduce:group-hover:translate-x-0'
                )}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <StarRating rating={ratingAvg} reviewCount={reviewCount} size="xs" />
            <p className="text-[0.6875rem] leading-snug text-text-secondary line-clamp-1 sm:text-xs">
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
        <ShowcaseImage
          src={project.cover_image_url}
          fallbackSrc={project.cover_fallback_url}
          alt={`${project.title} e-commerce website template`}
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
