'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn, focusVisibleRing } from '@/lib/cn';
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
          <div className="relative aspect-card overflow-hidden rounded-t-xl bg-background-soft sm:rounded-t-2xl">
            <ShowcaseImage
              src={project.cover_image_url}
              fallbackSrc={project.cover_fallback_url}
              alt={`${project.title} custom e-commerce website design`}
              width={800}
              height={600}
              eager={eager || priority}
              priority={priority}
              fit="cover"
              className="h-full w-full"
              imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              sizes={HOME_SIZES}
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
        className="relative block aspect-card overflow-hidden bg-background-soft"
        prefetch={false}
        onMouseEnter={prefetchDetail}
        onFocus={prefetchDetail}
      >
        {project.featured ? (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-[#0f2744] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">
            Featured
          </span>
        ) : null}
        <ShowcaseImage
          src={project.cover_image_url}
          fallbackSrc={project.cover_fallback_url}
          alt={`${project.title} custom e-commerce website design`}
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
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {categoryLabel}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug text-text-primary">
            <Link
              href={href}
              className="hover:text-emerald-700 dark:hover:text-emerald-400"
              prefetch={false}
              onMouseEnter={prefetchDetail}
              onFocus={prefetchDetail}
            >
              {project.title}
            </Link>
          </h3>
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
            'bg-[#0f2744] text-white transition-colors hover:bg-[#16375f]'
          )}
        >
          View Website
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export { ProjectCardSkeleton } from '@/src/components/skeletons/ProjectCardSkeleton';
