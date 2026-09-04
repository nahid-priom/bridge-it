'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
import type { SoftwareProjectCard } from '../types';
import { SoftwareShowcaseImage } from './SoftwareShowcaseImage';

export function softwareDetailUrl(slug: string): string {
  return `/software/${slug}`;
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
  const href = softwareDetailUrl(project.slug);
  const loadEager = eager || priority;
  const categoryLabel =
    project.taxonomy_category_name ?? project.child_category_name ?? project.category_name ?? 'Software';
  const outcome =
    project.feature_summary ?? project.short_description ?? project.industry ?? project.business_type;
  const features = project.primary_features?.slice(0, 3) ?? [];

  const prefetchDetail = () => {
    router.prefetch(href);
  };

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
          <div className="overflow-hidden rounded-t-xl sm:rounded-t-2xl">
            <SoftwareShowcaseImage
              kind="card"
              project={project}
              eager={loadEager}
              priority={priority}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 320px) 50vw, 100vw"
              className="w-full"
              imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
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
        <SoftwareShowcaseImage
          kind="card"
          project={project}
          eager={loadEager}
          priority={priority}
          className="h-full w-full"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {categoryLabel}
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
          {outcome ? <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{outcome}</p> : null}
        </div>
        {features.length > 0 ? (
          <ul className="mt-1 space-y-1.5">
            {features.map((feature) => (
              <li key={feature.id} className="flex items-start gap-2 text-sm text-text-secondary">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                <span className="line-clamp-1">{feature.title}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href={href}
          prefetch={false}
          onMouseEnter={prefetchDetail}
          onFocus={prefetchDetail}
          className={cn(
            'mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold',
            'bg-[#0f2744] text-white transition-colors hover:bg-[#16375f]'
          )}
        >
          Explore Software
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
        <div className="h-3 w-5/6 animate-pulse rounded bg-background-soft" />
        <div className="h-3 w-4/6 animate-pulse rounded bg-background-soft" />
        <div className="mt-auto h-10 w-full animate-pulse rounded-xl bg-background-soft" />
      </div>
    </div>
  );
}
