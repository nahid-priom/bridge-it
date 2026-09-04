'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Check, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import type { SoftwareProductFeature, SoftwareProjectDetail, SoftwareProjectScreen } from '../types';

function screenImageUrl(screen: SoftwareProjectScreen | null | undefined): string | null {
  if (!screen) return null;
  return screen.image_url || screen.thumbnail_url || null;
}

function screenThumbUrl(screen: SoftwareProjectScreen | null | undefined): string | null {
  if (!screen) return null;
  return screen.thumbnail_url || screen.image_url || null;
}

function screenLabel(screen: SoftwareProjectScreen): string {
  return screen.module_name || screen.screen_name;
}

function preloadImage(url: string): void {
  if (!url || typeof window === 'undefined') return;
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <section className="mt-10 max-w-4xl lg:mt-14">
      <h2 className="mb-3 font-display text-xl font-black text-text-primary md:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function ManageChips({ features }: { features: SoftwareProductFeature[] }) {
  const primary = features.filter((f) => f.is_primary).slice(0, 6);
  const items = primary.length > 0 ? primary : features.slice(0, 6);
  if (items.length === 0) return null;
  return (
    <Section title="What You Can Manage">
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((feature) => (
          <li
            key={feature.id}
            className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
              <Check className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">{feature.title}</p>
              {feature.short_description ? (
                <p className="mt-0.5 text-xs text-text-secondary">{feature.short_description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function SoftwarePreview({ project }: { project: SoftwareProjectDetail }) {
  const screens = useMemo(
    () => project.screens.filter((screen) => screen.published).sort((a, b) => a.sort_order - b.sort_order),
    [project.screens]
  );
  const features = useMemo(
    () => project.features.filter((f) => f.published).sort((a, b) => a.sort_order - b.sort_order),
    [project.features]
  );

  const initial =
    screens.find((screen) => screen.is_featured) ?? screens.find((screen) => screenImageUrl(screen)) ?? screens[0];

  const [selectedKey, setSelectedKey] = useState(initial?.screen_key);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const selected = screens.find((screen) => screen.screen_key === selectedKey) ?? initial ?? null;
  const imageUrl = screenImageUrl(selected);
  const categoryLabel =
    project.taxonomy_category?.name ?? project.child_category?.name ?? project.category?.name ?? 'Software';
  const cover = project.cover_detail_url ?? project.cover_card_url;
  const outcome = project.feature_summary ?? project.short_description;

  useEffect(() => {
    if (!selectedKey && initial?.screen_key) setSelectedKey(initial.screen_key);
  }, [initial?.screen_key, selectedKey]);

  useEffect(() => {
    if (!imageUrl) return;
    preloadImage(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (!viewAllOpen && !fullscreen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewAllOpen(false);
        setFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewAllOpen, fullscreen]);

  const selectScreen = (screen: SoftwareProjectScreen) => {
    setSelectedKey(screen.screen_key);
    const url = screenImageUrl(screen);
    if (url) preloadImage(url);
  };

  const keyFeatures = features.length > 0 ? features : project.modules.map((title, index) => ({
    id: `module-${index}`,
    project_id: project.id,
    title,
    short_description: null,
    icon_key: null,
    sort_order: index,
    is_primary: index < 3,
    published: true,
    created_at: '',
    updated_at: '',
    deleted_at: null,
  }));

  return (
    <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-16">
      <div className="mx-auto w-full max-w-[1480px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 xl:px-10">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa]">
            {categoryLabel}
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] font-black leading-tight text-text-primary sm:text-3xl lg:text-4xl">
            {project.title}
          </h1>
          {outcome ? (
            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">{outcome}</p>
          ) : null}
        </header>

        {cover ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle bg-background-soft">
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
        ) : (
          <div className="mt-6 aspect-[16/10] animate-pulse rounded-2xl bg-background-soft" aria-hidden />
        )}

        <ManageChips features={features} />

        {screens.length > 0 ? (
          <section className="mt-10 lg:mt-14" aria-label="Explore the system">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-xl font-black text-text-primary md:text-2xl">
                Explore The System
              </h2>
              <button
                type="button"
                onClick={() => setViewAllOpen(true)}
                className="text-sm font-semibold text-[#2563eb] hover:underline"
              >
                View All Screens
              </button>
            </div>

            {/* Desktop: left nav + canvas */}
            <div className="hidden gap-5 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
              <nav
                className="max-h-[min(70vh,640px)] space-y-1 overflow-y-auto rounded-2xl border border-border-subtle bg-surface p-2"
                aria-label="Modules"
              >
                {screens.map((screen) => {
                  const active = screen.screen_key === selected?.screen_key;
                  return (
                    <button
                      key={screen.id}
                      type="button"
                      onClick={() => selectScreen(screen)}
                      onMouseEnter={() => {
                        const url = screenImageUrl(screen);
                        if (url) preloadImage(url);
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                        active
                          ? 'bg-[#0f2744] text-white'
                          : 'text-text-secondary hover:bg-background-soft hover:text-text-primary'
                      )}
                    >
                      <span className="line-clamp-1">{screenLabel(screen)}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-background-soft">
                {imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    <button
                      type="button"
                      onClick={() => setFullscreen(true)}
                      className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur"
                    >
                      <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                      Fullscreen
                    </button>
                  </>
                ) : (
                  <div className="flex min-h-[360px] items-center justify-center text-sm text-text-muted">
                    Screen preview unavailable
                  </div>
                )}
                {selected?.short_caption ? (
                  <p className="border-t border-border-subtle px-4 py-2.5 text-sm text-text-secondary">
                    {selected.short_caption}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Mobile: full-width stacked */}
            <div className="lg:hidden">
              <label htmlFor="software-screen-select" className="sr-only">
                Select screen
              </label>
              <select
                id="software-screen-select"
                value={selected?.screen_key ?? ''}
                onChange={(event) => {
                  const next = screens.find((s) => s.screen_key === event.target.value);
                  if (next) selectScreen(next);
                }}
                className="mb-3 h-11 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm font-medium"
              >
                {screens.map((screen) => (
                  <option key={screen.id} value={screen.screen_key}>
                    {screenLabel(screen)}
                  </option>
                ))}
              </select>
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
                    onClick={() => setFullscreen(true)}
                  />
                ) : (
                  <div className="flex min-h-[240px] items-center justify-center text-sm text-text-muted">
                    Screen preview unavailable
                  </div>
                )}
              </div>
              {selected?.short_caption ? (
                <p className="mt-2 text-sm text-text-secondary">{selected.short_caption}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        <Section title="Key Features">
          {keyFeatures.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {keyFeatures.map((feature) => (
                <li
                  key={feature.id}
                  className="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm font-medium text-text-primary"
                >
                  {feature.title}
                </li>
              ))}
            </ul>
          ) : null}
        </Section>

        {project.full_description ? (
          <Section title="Benefits">
            <p className="leading-relaxed text-text-secondary whitespace-pre-line line-clamp-8">
              {project.full_description.replace(/Starting\s*৳[\d,]+[+]?/gi, '').replace(/৳[\d,]+[+]?/g, '')}
            </p>
          </Section>
        ) : null}

        {project.related_websites_cta ? (
          <section className="mt-10 rounded-2xl border border-border-subtle bg-surface px-6 py-6 lg:mt-14">
            <h2 className="font-display text-lg font-black text-text-primary">Need a storefront too?</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Pair this admin system with a ready e-commerce website.
            </p>
            <Link
              href={ROUTES.websites}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-border-subtle px-4 text-sm font-semibold hover:border-[#2563eb]/40"
            >
              Browse Websites
            </Link>
          </section>
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

      {/* Sticky Free Demo */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto max-w-lg">
          <Link
            href={ROUTES.consultation}
            className="flex w-full items-center justify-center rounded-xl bg-[#2563eb] py-3 font-semibold text-white"
          >
            Free Demo
          </Link>
        </div>
      </div>

      {/* View All Screens sheet */}
      {viewAllOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-background p-4 sm:rounded-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-black">All Screens</h3>
              <button type="button" onClick={() => setViewAllOpen(false)} className="rounded-lg p-2 hover:bg-background-soft" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {screens.map((screen) => {
                const thumb = screenThumbUrl(screen);
                return (
                  <button
                    key={screen.id}
                    type="button"
                    className="overflow-hidden rounded-xl border border-border-subtle text-left"
                    onClick={() => {
                      selectScreen(screen);
                      setViewAllOpen(false);
                    }}
                  >
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="aspect-[16/10] w-full object-cover object-top" loading="lazy" />
                    ) : (
                      <div className="aspect-[16/10] bg-background-soft" />
                    )}
                    <p className="truncate px-2 py-2 text-xs font-semibold">{screenLabel(screen)}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Fullscreen lightbox */}
      {fullscreen && imageUrl ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal>
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 rounded-lg bg-white/10 p-2 text-white"
            aria-label="Close fullscreen"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`${project.title} — ${selected?.screen_name ?? 'screen'}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}

export function SoftwarePreviewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-4 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading software">
      <div className="h-3 w-24 animate-pulse rounded bg-background-soft" />
      <div className="mt-3 h-9 w-2/3 animate-pulse rounded bg-background-soft" />
      <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-background-soft" />
      <div className="mt-6 aspect-[16/10] w-full animate-pulse rounded-2xl bg-background-soft" />
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-background-soft" />
        ))}
      </div>
      <div className="mt-10 hidden gap-5 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="h-80 animate-pulse rounded-2xl bg-background-soft" />
        <div className="aspect-[16/10] animate-pulse rounded-2xl bg-background-soft" />
      </div>
    </div>
  );
}
