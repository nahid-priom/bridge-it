'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import type { SoftwareProductFeature, SoftwareProjectDetail, SoftwareProjectScreen } from '../types';
import {
  resolveSoftwareCover,
  resolveSoftwareScreen,
  withCacheBust,
} from '../utils/resolve-software-asset';

function screenImageUrl(
  screen: SoftwareProjectScreen | null | undefined,
  assetVersion = 1
): string | null {
  if (!screen) return null;
  const resolved = resolveSoftwareScreen(screen, 'preview', assetVersion);
  return resolved ? withCacheBust(resolved.url, resolved.assetVersion) : null;
}

function screenThumbUrl(
  screen: SoftwareProjectScreen | null | undefined,
  assetVersion = 1
): string | null {
  if (!screen) return null;
  const resolved = resolveSoftwareScreen(screen, 'thumb', assetVersion);
  return resolved ? withCacheBust(resolved.url, resolved.assetVersion) : null;
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
      <ul className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {items.map((feature) => (
          <li
            key={feature.id}
            className="rounded-xl border border-border-subtle bg-surface px-3 py-2.5 sm:px-3.5 sm:py-3"
          >
            <p className="text-[0.9375rem] font-semibold leading-snug text-text-primary sm:text-base">
              {feature.title}
            </p>
            {feature.short_description ? (
              <p className="mt-0.5 hidden text-sm text-text-secondary sm:line-clamp-2 sm:block">
                {feature.short_description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ScreenChrome({
  title,
  index,
  total,
  canPrev,
  canNext,
  onPrev,
  onNext,
  className,
}: {
  title: string;
  index: number;
  total: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous screen"
        className={cn(
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface',
          canPrev ? 'text-text-primary hover:border-[#2563eb]/40' : 'cursor-not-allowed text-text-muted opacity-40'
        )}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-[0.9375rem] font-bold text-text-primary sm:text-base">{title}</p>
        <p className="mt-0.5 text-sm tabular-nums text-text-muted">
          {index} / {total}
        </p>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next screen"
        className={cn(
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface',
          canNext ? 'text-text-primary hover:border-[#2563eb]/40' : 'cursor-not-allowed text-text-muted opacity-40'
        )}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}

export function SoftwarePreview({ project }: { project: SoftwareProjectDetail }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const screens = useMemo(
    () => project.screens.filter((screen) => screen.published).sort((a, b) => a.sort_order - b.sort_order),
    [project.screens]
  );
  const features = useMemo(
    () => project.features.filter((f) => f.published).sort((a, b) => a.sort_order - b.sort_order),
    [project.features]
  );

  const assetVersion = project.asset_version ?? 1;
  const screenFromUrl = searchParams.get('screen');
  const initial =
    (screenFromUrl ? screens.find((s) => s.screen_key === screenFromUrl) : null) ??
    screens.find((screen) => screen.is_featured) ??
    screens.find((screen) => screenImageUrl(screen, assetVersion)) ??
    screens[0];

  const [selectedKey, setSelectedKey] = useState(initial?.screen_key);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useRef(false);

  const selected = screens.find((screen) => screen.screen_key === selectedKey) ?? initial ?? null;
  const selectedIndex = selected ? screens.findIndex((s) => s.screen_key === selected.screen_key) : 0;
  const imageUrl = screenImageUrl(selected, assetVersion);
  const canPrev = selectedIndex > 0;
  const canNext = selectedIndex >= 0 && selectedIndex < screens.length - 1;
  const categoryLabel =
    project.taxonomy_category?.name ?? project.child_category?.name ?? project.category?.name ?? 'Software';
  const coverResolved = resolveSoftwareCover(project, 'detail');
  const cover = coverResolved ? withCacheBust(coverResolved.url, coverResolved.assetVersion) : null;
  const outcome = project.feature_summary ?? project.short_description;

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!selectedKey && initial?.screen_key) setSelectedKey(initial.screen_key);
  }, [initial?.screen_key, selectedKey]);

  useEffect(() => {
    if (screenFromUrl && screens.some((s) => s.screen_key === screenFromUrl)) {
      setSelectedKey(screenFromUrl);
    }
  }, [screenFromUrl, screens]);

  const syncUrl = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get('screen') === key) return;
      params.set('screen', key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const selectScreen = useCallback(
    (screen: SoftwareProjectScreen) => {
      setSelectedKey(screen.screen_key);
      syncUrl(screen.screen_key);
      const url = screenImageUrl(screen, assetVersion);
      if (url) preloadImage(url);
    },
    [assetVersion, syncUrl]
  );

  const goRelative = useCallback(
    (dir: -1 | 1) => {
      if (selectedIndex < 0) return;
      const next = screens[selectedIndex + dir];
      if (next) selectScreen(next);
    },
    [selectScreen, selectedIndex, screens]
  );

  useEffect(() => {
    if (!imageUrl) return;
    preloadImage(imageUrl);
    const next = screens[selectedIndex + 1];
    const prev = screens[selectedIndex - 1];
    const idle = window.setTimeout(() => {
      const nUrl = screenImageUrl(next, assetVersion);
      const pUrl = screenImageUrl(prev, assetVersion);
      if (nUrl) preloadImage(nUrl);
      if (pUrl) preloadImage(pUrl);
    }, 250);
    return () => window.clearTimeout(idle);
  }, [assetVersion, imageUrl, screens, selectedIndex]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewAllOpen(false);
        setFullscreen(false);
        return;
      }
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (typing) return;
      if (fullscreen || previewRef.current?.contains(document.activeElement) || document.activeElement === document.body) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goRelative(-1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goRelative(1);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, goRelative, viewAllOpen]);

  const onPointerDown = (event: ReactPointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goRelative(1);
    else goRelative(-1);
  };

  const keyFeatures =
    features.length > 0
      ? features
      : project.modules.map((title, index) => ({
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

  const chromeProps = {
    title: selected ? screenLabel(selected) : 'Screen',
    index: selectedIndex + 1,
    total: screens.length,
    canPrev,
    canNext,
    onPrev: () => goRelative(-1),
    onNext: () => goRelative(1),
  };

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

            <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
              {/* Desktop sidebar */}
              <nav className="hidden lg:block" aria-label="Modules">
                <ul className="sticky top-24 space-y-1 rounded-2xl border border-border-subtle bg-surface p-2">
                  {screens.map((screen) => {
                    const active = screen.screen_key === selected?.screen_key;
                    return (
                      <li key={screen.id}>
                        <button
                          type="button"
                          aria-current={active ? 'page' : undefined}
                          onClick={() => selectScreen(screen)}
                          onMouseEnter={() => {
                            const url = screenImageUrl(screen, assetVersion);
                            if (url) preloadImage(url);
                          }}
                          className={cn(
                            'w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                            active
                              ? 'bg-[#0f2744] text-white'
                              : 'text-text-secondary hover:bg-background-soft hover:text-text-primary'
                          )}
                        >
                          {screenLabel(screen)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div>
                <ScreenChrome {...chromeProps} className="mb-3" />

                <div
                  ref={previewRef}
                  tabIndex={0}
                  className="relative overflow-hidden rounded-2xl border border-border-subtle bg-background-soft outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/40"
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                >
                  {imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={imageUrl}
                        src={imageUrl}
                        alt={`${project.title} — ${selected?.screen_name ?? 'screen'}`}
                        width={selected?.image_width ?? 1100}
                        height={selected?.image_height ?? 688}
                        loading="lazy"
                        decoding="async"
                        className={cn(
                          'h-auto w-full cursor-zoom-in object-contain object-top lg:cursor-default',
                          !reducedMotion.current && 'motion-safe:transition-opacity motion-safe:duration-200'
                        )}
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
                            setFullscreen(true);
                          }
                        }}
                        draggable={false}
                      />
                      <button
                        type="button"
                        onClick={() => setFullscreen(true)}
                        className="absolute right-3 top-3 hidden items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur lg:inline-flex"
                      >
                        <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                        Fullscreen
                      </button>
                    </>
                  ) : (
                    <div className="flex min-h-[240px] items-center justify-center text-sm text-text-muted lg:min-h-[360px]">
                      Screen preview unavailable
                    </div>
                  )}
                  {selected?.short_caption ? (
                    <p className="border-t border-border-subtle px-4 py-2.5 text-sm text-text-secondary">
                      {selected.short_caption}
                    </p>
                  ) : null}
                </div>

                <p className="mt-2 text-center text-xs text-text-muted lg:hidden">Swipe to browse</p>

                {/* Thumbnail strip */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Screen thumbnails">
                  {screens.map((screen, i) => {
                    const thumb = screenThumbUrl(screen, assetVersion);
                    const active = screen.screen_key === selected?.screen_key;
                    return (
                      <button
                        key={screen.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-current={active ? 'true' : undefined}
                        aria-label={screenLabel(screen)}
                        onClick={() => selectScreen(screen)}
                        className={cn(
                          'shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                          active ? 'border-[#2563eb]' : 'border-transparent opacity-80 hover:opacity-100'
                        )}
                      >
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="h-14 w-[88px] object-cover object-top" loading="lazy" />
                        ) : (
                          <div className="flex h-14 w-[88px] items-center justify-center bg-background-soft text-[10px] text-text-muted">
                            {i + 1}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <Section title="Key Features">
          {keyFeatures.length > 0 ? (
            <ul className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {keyFeatures.map((feature) => (
                <li
                  key={feature.id}
                  className="rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-[0.9375rem] font-medium text-text-primary sm:px-4 sm:py-3 sm:text-sm"
                >
                  {feature.title}
                </li>
              ))}
            </ul>
          ) : null}
        </Section>

        {project.full_description ? (
          <Section title="Business Workflow">
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
                const thumb = screenThumbUrl(screen, assetVersion);
                const active = screen.screen_key === selected?.screen_key;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'overflow-hidden rounded-xl border text-left',
                      active ? 'border-[#2563eb]' : 'border-border-subtle'
                    )}
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

      {fullscreen && imageUrl ? (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-black/90 p-4"
          role="dialog"
          aria-modal
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="mb-3 flex items-center justify-between gap-3 text-white">
            <ScreenChrome
              {...chromeProps}
              className="flex-1 [&_button]:border-white/20 [&_button]:bg-white/10 [&_button]:text-white [&_p]:text-white"
            />
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white"
              aria-label="Close fullscreen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`${project.title} — ${selected?.screen_name ?? 'screen'}`}
            className="mx-auto max-h-[calc(100%-5rem)] max-w-full object-contain"
            draggable={false}
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
      <div className="mt-10 space-y-3">
        <div className="aspect-[16/10] animate-pulse rounded-2xl bg-background-soft" />
      </div>
    </div>
  );
}
