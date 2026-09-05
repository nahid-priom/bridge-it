'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { CREATIVE_COVER_CARD, creativeServiceGroupLabel } from '../config/constants';
import type { CreativeMarketingProjectCard } from '../types';
import { formatCreativeStartingPrice } from './format-price';

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
  const cover = project.cover_card_url;
  const loadEager = eager || priority;
  const categoryLabel =
    project.industry_name ?? creativeServiceGroupLabel(project.service_group);

  const prefetchDetail = () => router.prefetch(href);

  if (variant === 'home') {
    return (
      <article
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface sm:rounded-2xl',
          'transition-[transform,border-color,box-shadow] duration-300 ease-out',
          'hover:-translate-y-0.5 hover:border-[#2563eb]/45 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.12)]',
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
              'relative overflow-hidden rounded-t-xl bg-background-soft sm:rounded-t-2xl',
              CREATIVE_COVER_CARD.aspectClass
            )}
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={`${project.title} service`}
                width={CREATIVE_COVER_CARD.width}
                height={CREATIVE_COVER_CARD.height}
                loading={loadEager ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={priority ? 'high' : 'auto'}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 320px) 50vw, 100vw"
                className="h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-background-soft" aria-hidden />
            )}
          </div>
          <div className="flex flex-1 items-start justify-between gap-2 p-3 sm:p-3.5">
            <div className="min-w-0 flex-1">
              <h4 className="font-display text-sm font-bold leading-snug text-text-primary line-clamp-2 sm:text-[0.9375rem]">
                {project.title}
              </h4>
              <p className="mt-0.5 text-xs text-text-muted line-clamp-1">{categoryLabel}</p>
            </div>
            <span
              aria-hidden
              className={cn(
                'mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-soft text-text-primary',
                'transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-[#2563eb]/50 group-hover:bg-[#2563eb] group-hover:text-white',
                'motion-reduce:transition-none motion-reduce:group-hover:translate-x-0'
              )}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
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
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`${project.title} service`}
            width={CREATIVE_COVER_CARD.width}
            height={CREATIVE_COVER_CARD.height}
            loading={loadEager ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            className="h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-soft" aria-hidden />
        )}
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
