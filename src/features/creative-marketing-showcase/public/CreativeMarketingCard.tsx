'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { cardElaboration } from '@/src/features/catalog/utils/card-elaboration';
import { CREATIVE_COVER_CARD, creativeServiceGroupLabel } from '../config/constants';
import type { CreativeMarketingProjectCard } from '../types';
import { formatCreativeStartingPrice } from './format-price';
import { CatalogCoverImage } from '@/src/features/catalog/components/CatalogCoverImage';

export function creativeDetailUrl(
  slug: string,
  industrySlug?: string | null,
  canonicalPath?: string | null
): string {
  if (canonicalPath?.trim()) return canonicalPath.trim();
  if (industrySlug?.trim()) return ROUTES.marketingProduct(industrySlug.trim(), slug);
  return ROUTES.marketingIndustry(slug);
}

export function CreativeMarketingCard({
  project,
  eager = false,
  priority = false,
  variant = 'default',
}: {
  project: CreativeMarketingProjectCard;
  eager?: boolean;
  priority?: boolean;
  variant?: 'default' | 'home';
}) {
  const router = useRouter();
  const href = creativeDetailUrl(project.slug, project.industry_slug, project.canonical_path);
  const cover = project.coverImageUrl;
  const loadEager = eager || priority;
  const categoryLabel =
    project.industry_name ?? creativeServiceGroupLabel(project.service_group);
  const elaboration = cardElaboration(project.outcome_line ?? project.short_description, {
    fallback: 'Creative marketing that converts',
  });

  const prefetchDetail = () => router.prefetch(href);

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
          <div
            className={cn(
              'relative overflow-hidden rounded-t-xl bg-background-soft',
              CREATIVE_COVER_CARD.aspectClass
            )}
          >
            <CatalogCoverImage
              src={cover}
              alt={`${project.title} project preview`}
              emptyTitle={project.title}
              width={CREATIVE_COVER_CARD.width}
              height={CREATIVE_COVER_CARD.height}
              eager={loadEager}
              priority={priority}
              fit="contain"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 320px) 50vw, 100vw"
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
        className={cn(
          'relative block overflow-hidden bg-background-soft',
          CREATIVE_COVER_CARD.aspectClass
        )}
        prefetch={false}
        onMouseEnter={prefetchDetail}
        onFocus={prefetchDetail}
      >
        <CatalogCoverImage
          src={cover}
          alt={`${project.title} project preview`}
          emptyTitle={project.title}
          width={CREATIVE_COVER_CARD.width}
          height={CREATIVE_COVER_CARD.height}
          eager={loadEager}
          priority={priority}
          fit="contain"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {categoryLabel}
          </p>
          <h4 className="mt-1 font-display text-lg font-bold leading-snug text-text-primary">
            <Link href={href} prefetch={false} onMouseEnter={prefetchDetail} onFocus={prefetchDetail}>
              {project.title}
            </Link>
          </h4>
          {project.outcome_line || project.short_description ? (
            <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
              {project.outcome_line || project.short_description}
            </p>
          ) : null}
        </div>
        <p className="mt-auto text-sm font-semibold text-text-primary">
          {formatCreativeStartingPrice(project.starting_price, project.price_suffix, project.currency)}
        </p>
        <Link
          href={href}
          prefetch={false}
          onMouseEnter={prefetchDetail}
          onFocus={prefetchDetail}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold',
            'bg-[#0f2744] text-white transition-colors hover:bg-[#16375f]'
          )}
        >
          View Service
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function CreativeMarketingCardSkeleton() {
  return (
    <div aria-hidden className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <div className={cn('w-full animate-pulse bg-background-soft', CREATIVE_COVER_CARD.aspectClass)} />
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-background-soft" />
        <div className="mt-1 h-5 w-3/4 animate-pulse rounded bg-background-soft" />
        <div className="h-4 w-full animate-pulse rounded bg-background-soft" />
        <div className="mt-auto h-4 w-28 animate-pulse rounded bg-background-soft" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft" />
      </div>
    </div>
  );
}
