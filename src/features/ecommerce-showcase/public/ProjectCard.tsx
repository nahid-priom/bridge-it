'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { EcommerceProjectCard } from '../types';
import { formatStartingPrice, websiteDetailUrl } from '../utils/filters';
import { ShowcaseImage } from './ShowcaseImage';

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
  const href = websiteDetailUrl(project.slug);

  const prefetchDetail = () => {
    router.prefetch(href);
  };

  if (variant === 'home') {
    return (
      <article
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface',
          'transition-[transform,border-color] duration-300 ease-out',
          'hover:-translate-y-0.5 hover:border-[#2563eb]/40',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        )}
      >
        <Link
          href={href}
          className="relative block aspect-[16/10] overflow-hidden bg-background-soft"
          prefetch={false}
          onMouseEnter={prefetchDetail}
          onFocus={prefetchDetail}
        >
          <ShowcaseImage
            src={project.cover_image_url}
            fallbackSrc={project.cover_fallback_url}
            alt={`${project.title} cover`}
            width={1600}
            height={1000}
            eager={eager || priority}
            priority={priority}
            fit="cover"
            className="h-full w-full"
            imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </Link>
        <div className="flex items-end justify-between gap-3 p-3.5 sm:p-4">
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold leading-snug text-text-primary sm:text-lg">
              <Link
                href={href}
                className="hover:text-[#2563eb] dark:hover:text-[#60a5fa]"
                prefetch={false}
                onMouseEnter={prefetchDetail}
                onFocus={prefetchDetail}
              >
                {project.title}
              </Link>
            </h3>
            <p className="mt-0.5 text-sm text-text-secondary">
              {project.category_name ?? project.industry ?? 'E-commerce'}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-text-primary">
              {formatStartingPrice(project.starting_price, project.currency)}
            </p>
          </div>
          <Link
            href={href}
            prefetch={false}
            onMouseEnter={prefetchDetail}
            onFocus={prefetchDetail}
            aria-label={`View ${project.title}`}
            className={cn(
              'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-soft text-text-primary',
              'transition-colors hover:border-[#2563eb]/50 hover:bg-[#2563eb] hover:text-white',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]'
            )}
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <Link
        href={href}
        className="relative block aspect-[16/10] min-h-[220px] overflow-hidden bg-background-soft sm:min-h-[260px]"
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
          alt={`${project.title} cover`}
          width={1600}
          height={1000}
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
            {project.category_name ?? project.industry ?? 'E-commerce'}
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
        <p className="mt-auto text-sm font-semibold text-text-primary">
          {formatStartingPrice(project.starting_price, project.currency)}
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
          View Website
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export { ProjectCardSkeleton } from '@/src/components/skeletons/ProjectCardSkeleton';
