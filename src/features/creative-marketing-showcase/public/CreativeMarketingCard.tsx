'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { creativeServiceGroupLabel } from '../config/constants';
import type { CreativeMarketingProjectCard } from '../types';
import { formatCreativeStartingPrice } from './format-price';

export function creativeDetailUrl(slug: string): string {
  return `/creative-marketing/${slug}`;
}

export function CreativeMarketingCard({
  project,
  eager = false,
  priority = false,
}: {
  project: CreativeMarketingProjectCard;
  eager?: boolean;
  priority?: boolean;
}) {
  const router = useRouter();
  const href = creativeDetailUrl(project.slug);
  const cover = project.cover_card_url;
  const loadEager = eager || priority;

  const prefetchDetail = () => router.prefetch(href);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <Link
        href={href}
        className="relative block aspect-[4/3] min-h-[220px] overflow-hidden bg-background-soft sm:min-h-[240px]"
        prefetch={false}
        onMouseEnter={prefetchDetail}
        onFocus={prefetchDetail}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`${project.title} service`}
            width={720}
            height={540}
            loading={loadEager ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-soft" aria-hidden />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {creativeServiceGroupLabel(project.service_group)}
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
      <div className="aspect-[4/3] min-h-[220px] w-full animate-pulse bg-background-soft sm:min-h-[240px]" />
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
