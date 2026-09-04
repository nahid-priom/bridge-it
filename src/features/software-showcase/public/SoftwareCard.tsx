'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { solutionGroupLabel } from '../config/constants';
import type { SoftwareProjectCard } from '../types';
import { formatStartingPrice } from './format-price';

export function softwareDetailUrl(slug: string): string {
  return `/software/${slug}`;
}

export function SoftwareCard({
  project,
  eager = false,
  priority = false,
}: {
  project: SoftwareProjectCard;
  eager?: boolean;
  priority?: boolean;
}) {
  const router = useRouter();
  const href = softwareDetailUrl(project.slug);
  const cover = project.cover_card_url ?? project.cover_detail_url;
  const loadEager = eager || priority;
  const groupLabel = solutionGroupLabel(project.solution_group);
  const industryLine = project.industry ?? project.business_type ?? project.short_description;

  const prefetchDetail = () => {
    router.prefetch(href);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <Link
        href={href}
        className="relative block aspect-[16/10] min-h-[200px] overflow-hidden bg-background-soft sm:min-h-[220px]"
        prefetch={false}
        onMouseEnter={prefetchDetail}
        onFocus={prefetchDetail}
      >
        {project.featured ? (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-[#0f2744] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">
            Featured
          </span>
        ) : null}
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`${project.title} software solution`}
            width={720}
            height={450}
            loading={loadEager ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-text-muted">
            No cover
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {groupLabel}
          </p>
          <h4 className="mt-1 font-display text-lg font-bold leading-snug text-text-primary">
            <Link
              href={href}
              className="hover:text-emerald-700 dark:hover:text-emerald-400"
              prefetch={false}
              onMouseEnter={prefetchDetail}
              onFocus={prefetchDetail}
            >
              {project.title}
            </Link>
          </h4>
          {industryLine ? (
            <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{industryLine}</p>
          ) : null}
        </div>
        <p className="mt-auto text-sm font-semibold text-text-primary">
          {formatStartingPrice(project.starting_price, project.price_suffix, project.currency)}
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
          View Software
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
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
      <div className="aspect-[16/10] min-h-[200px] w-full animate-pulse bg-background-soft sm:min-h-[220px]" />
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-background-soft" />
        <div className="mt-1 h-5 w-3/4 animate-pulse rounded bg-background-soft" />
        <div className="h-4 w-full animate-pulse rounded bg-background-soft" />
        <div className="mt-auto h-4 w-32 animate-pulse rounded bg-background-soft" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-background-soft" />
      </div>
    </div>
  );
}
