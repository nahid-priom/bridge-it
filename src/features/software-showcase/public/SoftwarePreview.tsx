'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { solutionGroupLabel } from '../config/constants';
import type { SoftwarePackage, SoftwareProjectDetail, SoftwareProjectScreen } from '../types';
import { formatSoftwarePackagePrice, formatStartingPrice } from './format-price';

function screenImageUrl(screen: SoftwareProjectScreen | null | undefined): string | null {
  if (!screen) return null;
  return screen.image_url || screen.thumbnail_url || null;
}

function screenThumbUrl(screen: SoftwareProjectScreen | null | undefined): string | null {
  if (!screen) return null;
  return screen.thumbnail_url || screen.image_url || null;
}

function preloadImage(url: string): void {
  if (!url || typeof window === 'undefined') return;
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

type ParsedNarrative = {
  problem: string;
  solution: string;
  modulesText: string;
  remainder: string;
};

function parseFullDescription(full: string | null | undefined): ParsedNarrative {
  const text = (full ?? '').trim();
  if (!text) {
    return { problem: '', solution: '', modulesText: '', remainder: '' };
  }

  const markers = [
    { key: 'problem' as const, re: /Business Problem:\s*/i },
    { key: 'solution' as const, re: /Solution:\s*/i },
    { key: 'modulesText' as const, re: /Main Modules:\s*/i },
    { key: 'who' as const, re: /Who It Is For:\s*/i },
  ];

  const positions: Array<{ key: string; index: number; len: number }> = [];
  for (const marker of markers) {
    const match = marker.re.exec(text);
    if (match) positions.push({ key: marker.key, index: match.index, len: match[0].length });
  }
  positions.sort((a, b) => a.index - b.index);

  if (positions.length === 0) {
    return { problem: '', solution: text, modulesText: '', remainder: '' };
  }

  const slices: Record<string, string> = {};
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index + positions[i].len;
    const end = i + 1 < positions.length ? positions[i + 1].index : text.length;
    slices[positions[i].key] = text.slice(start, end).trim();
  }

  return {
    problem: slices.problem ?? '',
    solution: slices.solution ?? '',
    modulesText: slices.modulesText ?? '',
    remainder: slices.who ?? '',
  };
}

function PackageList({ packages }: { packages: SoftwarePackage[] }) {
  if (packages.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className={cn(
            'rounded-2xl border p-4',
            pkg.is_popular
              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/10'
              : 'border-border-subtle'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-display font-bold">{pkg.name}</p>
            {pkg.is_popular ? (
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Popular</span>
            ) : null}
          </div>
          <p className="mt-2 text-xl font-black text-[#0f2744] dark:text-white">
            {formatSoftwarePackagePrice(pkg.price, pkg.currency)}
          </p>
          {pkg.short_description ? (
            <p className="mt-1 text-sm text-text-secondary">{pkg.short_description}</p>
          ) : null}
          {pkg.features.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
              {pkg.features.slice(0, 6).map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  if (!children) return null;
  return (
    <section className="mt-10 max-w-3xl lg:mt-14">
      <h2 className="mb-3 font-display text-xl font-black text-text-primary md:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export function SoftwarePreview({ project }: { project: SoftwareProjectDetail }) {
  const screens = useMemo(
    () => project.screens.filter((screen) => screen.published).sort((a, b) => a.sort_order - b.sort_order),
    [project.screens]
  );

  const initial =
    screens.find((screen) => screen.is_featured) ?? screens.find((screen) => screenImageUrl(screen)) ?? screens[0];

  const [selectedKey, setSelectedKey] = useState(initial?.screen_key);
  const selected = screens.find((screen) => screen.screen_key === selectedKey) ?? initial ?? null;
  const imageUrl = screenImageUrl(selected);
  const groupLabel = solutionGroupLabel(project.solution_group);
  const cover = project.cover_detail_url ?? project.cover_card_url;
  const narrative = useMemo(() => parseFullDescription(project.full_description), [project.full_description]);

  useEffect(() => {
    if (!selectedKey && initial?.screen_key) setSelectedKey(initial.screen_key);
  }, [initial?.screen_key, selectedKey]);

  useEffect(() => {
    if (!imageUrl) return;
    preloadImage(imageUrl);
  }, [imageUrl]);

  const selectScreen = (screen: SoftwareProjectScreen) => {
    setSelectedKey(screen.screen_key);
    const url = screenImageUrl(screen);
    if (url) preloadImage(url);
  };

  return (
    <div className="pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-[1480px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 xl:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.65fr)_minmax(280px,0.35fr)] lg:items-start lg:gap-8 xl:gap-10">
          <aside className="min-w-0 lg:order-2 lg:sticky lg:top-[calc(var(--header-offset)+0.75rem)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa]">
              {groupLabel}
            </p>
            <h1 className="mt-2 font-display text-[1.75rem] font-black leading-tight text-text-primary sm:text-3xl">
              {project.title}
            </h1>
            {project.industry ? (
              <p className="mt-2 text-sm text-text-secondary">{project.industry}</p>
            ) : null}
            <p className="mt-3 text-lg font-semibold text-text-primary">
              {formatStartingPrice(project.starting_price, project.price_suffix, project.currency)}
            </p>
            {project.short_description ? (
              <p className="mt-3 text-sm leading-relaxed text-text-secondary lg:text-[15px]">
                {project.short_description}
              </p>
            ) : null}
            {cover ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-border-subtle bg-background-soft lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={`${project.title} cover`}
                  width={1200}
                  height={750}
                  loading="eager"
                  decoding="async"
                  className="h-auto w-full object-cover object-top"
                />
              </div>
            ) : null}
            <div className="mt-5 hidden flex-col gap-2.5 lg:flex">
              <Link
                href={ROUTES.consultation}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563eb] px-5 py-3 text-center font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Free Demo
              </Link>
            </div>
          </aside>

          <section className="min-w-0 lg:order-1" aria-label="Software screen preview">
            {cover ? (
              <div className="mb-5 hidden overflow-hidden rounded-2xl border border-border-subtle bg-background-soft lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={`${project.title} cover`}
                  width={1200}
                  height={750}
                  loading="eager"
                  decoding="async"
                  className="h-auto w-full object-cover object-top"
                />
              </div>
            ) : null}

            {screens.length > 0 ? (
              <>
                <h2 className="mb-3 font-display text-xl font-black text-text-primary">Screens / Live Preview</h2>
                <div
                  className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="tablist"
                  aria-label="Software screens"
                >
                  {screens.map((screen) => {
                    const active = screen.screen_key === selected?.screen_key;
                    const thumb = screenThumbUrl(screen);
                    return (
                      <button
                        key={screen.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => selectScreen(screen)}
                        onMouseEnter={() => {
                          const url = screenImageUrl(screen);
                          if (url) preloadImage(url);
                        }}
                        className={cn(
                          'flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-sm font-semibold transition-colors',
                          active
                            ? 'bg-[#0f2744] text-white'
                            : 'border border-border-subtle text-text-secondary hover:border-[#2563eb]/40'
                        )}
                      >
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt=""
                            width={36}
                            height={24}
                            loading="lazy"
                            decoding="async"
                            className="h-6 w-9 rounded-md object-cover"
                          />
                        ) : null}
                        {screen.screen_name}
                      </button>
                    );
                  })}
                </div>
                <div className="overflow-hidden rounded-2xl border border-border-subtle bg-background-soft">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={imageUrl}
                      src={imageUrl}
                      alt={`${project.title} — ${selected?.screen_name ?? 'screen'}`}
                      width={selected?.image_width ?? 960}
                      height={selected?.image_height ?? 600}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full object-contain object-top"
                    />
                  ) : (
                    <div className="flex min-h-[280px] items-center justify-center text-sm text-text-muted">
                      Screen preview unavailable
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </section>
        </div>

        <Section title="Business Problem">
          {narrative.problem ? (
            <p className="leading-relaxed text-text-secondary whitespace-pre-line">{narrative.problem}</p>
          ) : null}
        </Section>

        <Section title="Software Solution">
          {narrative.solution ? (
            <p className="leading-relaxed text-text-secondary whitespace-pre-line">{narrative.solution}</p>
          ) : null}
        </Section>

        <Section title="Main Modules">
          {project.modules.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {project.modules.map((module) => (
                <li
                  key={module}
                  className="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm font-medium text-text-primary"
                >
                  {module}
                </li>
              ))}
            </ul>
          ) : narrative.modulesText ? (
            <p className="leading-relaxed text-text-secondary whitespace-pre-line">{narrative.modulesText}</p>
          ) : null}
        </Section>

        {project.packages.length > 0 ? (
          <section className="mt-10 lg:mt-14">
            <h2 className="mb-4 font-display text-xl font-black">Package / Starting Price</h2>
            <p className="mb-4 text-sm text-text-secondary">
              Starting{' '}
              <span className="font-semibold text-text-primary">
                {formatStartingPrice(project.starting_price, project.price_suffix, project.currency)}
              </span>
            </p>
            <PackageList packages={project.packages} />
          </section>
        ) : null}

        {narrative.remainder ? (
          <Section title="Who it is for">
            <p className="leading-relaxed text-text-secondary whitespace-pre-line">{narrative.remainder}</p>
          </Section>
        ) : null}

        <section className="mt-10 lg:mt-14">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border-subtle bg-surface px-6 py-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-xl font-black text-text-primary">Ready for a free demo?</h2>
              <p className="mt-1 text-sm text-text-secondary">
                See how this {project.software_type || 'software'} solution fits your business.
              </p>
            </div>
            <Link
              href={ROUTES.consultation}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
            >
              Free Demo
            </Link>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-lg">
          <Link
            href={ROUTES.consultation}
            className="flex w-full items-center justify-center rounded-xl bg-[#2563eb] py-3 font-semibold text-white"
          >
            Free Demo
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SoftwarePreviewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-4 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading software">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.65fr)_minmax(280px,0.35fr)]">
        <div className="order-2 space-y-3 lg:order-2">
          <div className="h-3 w-24 animate-pulse rounded bg-background-soft" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-background-soft" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-background-soft" />
          <div className="h-20 w-full animate-pulse rounded bg-background-soft" />
        </div>
        <div className="order-1 space-y-3 lg:order-1">
          <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-background-soft" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-background-soft" />
            ))}
          </div>
          <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-background-soft" />
        </div>
      </div>
    </div>
  );
}
