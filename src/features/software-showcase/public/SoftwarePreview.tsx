'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { formatCatalogPrice } from '@/src/features/catalog/components/CatalogPrice';
import { PackageBadge } from '@/src/features/catalog/components/PackageBadge';
import { ProductReviews } from '@/src/features/catalog/components/ProductReviews';
import { StarRating } from '@/src/features/catalog/components/StarRating';
import { fallbackRatingFromSlug } from '@/src/features/catalog/types/reviews';
import type { CatalogFaq } from '@/src/features/catalog/types';
import type { CatalogProductReview } from '@/src/features/catalog/types/reviews';
import type {
  SoftwarePackage,
  SoftwareProductFeature,
  SoftwareProjectDetail,
  SoftwareProjectScreen,
} from '../types';
import {
  resolveSoftwareCover,
  resolveSoftwareScreen,
  withCacheBust,
} from '../utils/resolve-software-asset';
import { SoftwareEmptyPreview } from './SoftwareEmptyPreview';
import { SoftwarePackageComparison } from './SoftwarePackageComparison';
import { SoftwarePackageLeadModal } from './SoftwarePackageLeadModal';
import { SoftwarePackageSelector } from './SoftwarePackageSelector';
import { SoftwareProductFaq } from './SoftwareProductFaq';
import { MaturityUpgradePath } from './MaturityUpgradePath';
import { SoftwareShowcaseImage } from './SoftwareShowcaseImage';
import { SelectedPackageSummary } from './SelectedPackageSummary';
import {
  groupPackageFeatures,
  includedFeatureRows,
  manageCardsFromPackage,
  screensForPackage,
  targetAudienceCopy,
} from './package-features';
import {
  packageDisplayName,
  pickDefaultPackage,
} from './package-utils';

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

export function SoftwarePreview({
  project,
  reviews = [],
  faqs = [],
}: {
  project: SoftwareProjectDetail;
  reviews?: CatalogProductReview[];
  faqs?: CatalogFaq[];
}) {
  const ratingFallback = fallbackRatingFromSlug(project.slug);
  const ratingAvg = project.rating_avg ?? ratingFallback.rating_avg;
  const reviewCount = project.review_count ?? ratingFallback.review_count;
  const activePackages = useMemo(
    () => project.packages.filter((pkg) => pkg.active !== false),
    [project.packages]
  );
  const hasPackages = activePackages.length > 0;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedPackage, setSelectedPackage] = useState<SoftwarePackage | null>(() =>
    pickDefaultPackage(activePackages, searchParams.get('package'))
  );

  // Keep selection in sync when ?package= changes (back/forward) without scrolling.
  useEffect(() => {
    if (activePackages.length === 0) return;
    const fromUrl = searchParams.get('package');
    const next = pickDefaultPackage(activePackages, fromUrl);
    if (!next) return;
    setSelectedPackage((prev) => (prev?.id === next.id ? prev : next));
  }, [activePackages, searchParams]);

  const [leadOpen, setLeadOpen] = useState(false);
  const [leadIntent, setLeadIntent] = useState<'demo' | 'order'>('order');

  const openLead = useCallback((intent: 'demo' | 'order') => {
    if (!selectedPackage) return;
    setLeadIntent(intent);
    setLeadOpen(true);
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: intent === 'demo' ? 'free_demo_click' : 'order_click',
        category_root: 'software',
        product: project.slug,
        package: selectedPackage.name,
        package_tier: selectedPackage.tier,
      });
    }
  }, [project.slug, selectedPackage]);

  const allScreens = useMemo(
    () => project.screens.filter((screen) => screen.published).sort((a, b) => a.sort_order - b.sort_order),
    [project.screens]
  );
  const screens = useMemo(
    () => screensForPackage(allScreens, selectedPackage?.id),
    [allScreens, selectedPackage?.id]
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
  const cover = coverResolved?.url ?? null;
  const outcome =
    selectedPackage?.short_description ?? project.feature_summary ?? project.short_description;

  const startingFrom = useMemo(() => {
    if (activePackages.length === 0) return project.starting_price;
    return Math.min(...activePackages.map((p) => p.price));
  }, [activePackages, project.starting_price]);

  const displayPrice = selectedPackage ? selectedPackage.price : startingFrom;
  const displayCurrency = selectedPackage?.currency ?? project.currency;
  const manageLabels = manageCardsFromPackage(selectedPackage);
  const featureGroups = groupPackageFeatures(
    includedFeatureRows(selectedPackage).length
      ? includedFeatureRows(selectedPackage)
      : []
  );

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    // Reset selected screen when package changes screen set
    const next =
      (screenFromUrl ? screens.find((s) => s.screen_key === screenFromUrl) : null) ??
      screens.find((screen) => screen.is_featured) ??
      screens[0];
    if (next && !screens.some((s) => s.screen_key === selectedKey)) {
      setSelectedKey(next.screen_key);
    }
  }, [screens, screenFromUrl, selectedKey]);

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

  const chromeProps = {
    title: selected ? screenLabel(selected) : 'Screen',
    index: Math.max(1, selectedIndex + 1),
    total: Math.max(1, screens.length),
    canPrev,
    canNext,
    onPrev: () => goRelative(-1),
    onNext: () => goRelative(1),
  };

  const orderLabel = selectedPackage ? `Order ${packageDisplayName(selectedPackage)}` : 'Order Now';

  return (
    <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-16">
      <div className="mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 lg:pt-[calc(var(--header-offset)+1rem)] xl:px-10">
        {/* Hero */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10">
          <header className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa]">
              {categoryLabel}
            </p>
            <h1 className="mt-2 font-display text-[1.75rem] font-black leading-tight text-text-primary sm:text-3xl lg:text-4xl">
              {project.title}
            </h1>
            <StarRating rating={ratingAvg} reviewCount={reviewCount} size="md" className="mt-2" />
            {outcome ? (
              <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">{outcome}</p>
            ) : null}

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Starting from</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-text-primary sm:text-3xl">
                {formatCatalogPrice(startingFrom, {
                  currency: displayCurrency,
                  suffix: selectedPackage ? null : project.price_suffix,
                })}
              </p>
              <p className="mt-0.5 text-sm text-text-muted">One Time Payment</p>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => openLead('demo')}
                disabled={!selectedPackage && hasPackages}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-border-subtle px-4 py-3 text-sm font-semibold disabled:opacity-50"
              >
                Free Demo
              </button>
              <button
                type="button"
                onClick={() => openLead('order')}
                disabled={!selectedPackage && hasPackages}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#0f2744] px-4 py-3 text-sm font-semibold text-white hover:bg-[#16375f] disabled:opacity-50 dark:bg-white dark:text-[#0f2744]"
              >
                {orderLabel}
              </button>
            </div>
          </header>

          <div className="min-w-0 lg:order-none">
            {cover ? (
              <div className="overflow-hidden rounded-2xl border border-border-subtle bg-[#0b1220]">
                <SoftwareShowcaseImage
                  kind="detail"
                  project={project}
                  priority
                  className="w-full"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
            ) : screens.length === 0 ? (
              <SoftwareEmptyPreview />
            ) : (
              <SoftwareEmptyPreview
                title="Preview coming soon"
                description="Cover art is being prepared. Explore system screens below or request a free demo."
              />
            )}
          </div>
        </div>

        {hasPackages ? (
          <SoftwarePackageSelector
            className="mt-8"
            packages={activePackages}
            productSlug={project.slug}
            value={selectedPackage}
            onChange={setSelectedPackage}
          />
        ) : null}

        {selectedPackage ? (
          <SelectedPackageSummary
            className="mt-6"
            pkg={selectedPackage}
            onDemo={() => openLead('demo')}
            onOrder={() => openLead('order')}
          />
        ) : null}

        {manageLabels.length > 0 ? (
          <Section title="What You Can Manage">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {manageLabels.map((label) => (
                <li
                  key={label}
                  className="rounded-xl border border-border-subtle bg-surface px-3 py-3 text-center text-[0.9375rem] font-semibold text-text-primary sm:py-4 sm:text-base"
                >
                  {label}
                </li>
              ))}
            </ul>
          </Section>
        ) : (
          <ManageChips features={features} />
        )}

        {featureGroups.length > 0 ? (
          <Section title="Package Features">
            <div className="space-y-5">
              {featureGroups.map(({ group, features: groupFeatures }) => (
                <div key={group}>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">{group}</h3>
                  <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {groupFeatures.map((feature) => (
                      <li
                        key={feature.id}
                        className="flex items-start gap-2 rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-text-primary"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                        <span>{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {screens.length > 0 ? (
          <section className="mt-10 lg:mt-14" aria-label="Explore the system">
            <h2 className="mb-3 font-display text-xl font-black text-text-primary md:text-2xl">
              Explore The System
            </h2>
            <ScreenChrome {...chromeProps} className="mb-3" />
            <div
              ref={previewRef}
              className="relative overflow-hidden rounded-2xl border border-border-subtle bg-[#0b1220]"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={selected ? screenLabel(selected) : project.title}
                  className="mx-auto max-h-[70vh] w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center text-sm text-white/60">
                  Preview unavailable
                </div>
              )}
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/50 text-white"
                aria-label="Fullscreen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {screens.map((screen) => {
                const thumb = screenThumbUrl(screen, assetVersion);
                const active = screen.screen_key === selected?.screen_key;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => selectScreen(screen)}
                    className={cn(
                      'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border',
                      active ? 'border-[#2563eb]' : 'border-border-subtle opacity-80 hover:opacity-100'
                    )}
                    aria-label={screenLabel(screen)}
                    aria-current={active ? 'true' : undefined}
                  >
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span className="flex h-full items-center justify-center bg-background-soft text-[10px]">
                        N/A
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {screens.length > 6 ? (
              <button
                type="button"
                onClick={() => setViewAllOpen(true)}
                className="mt-3 text-sm font-semibold text-[#2563eb] hover:underline"
              >
                View all screens
              </button>
            ) : null}
          </section>
        ) : null}

        {hasPackages ? (
          <SoftwarePackageComparison
            packages={activePackages}
            selectedPackageId={selectedPackage?.id}
            className="mt-10 lg:mt-14"
          />
        ) : null}

        {selectedPackage ? (
          <Section title="Who This Package Is For">
            <p className="max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
              {targetAudienceCopy(selectedPackage)}
            </p>
          </Section>
        ) : null}

        {selectedPackage ? (
          <Section title="What's Included">
            <ul className="space-y-2">
              {includedFeatureRows(selectedPackage)
                .slice(0, 8)
                .map((feature) => (
                  <li key={feature.id} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                    {feature.label}
                  </li>
                ))}
            </ul>
            <p className="mt-4 text-sm text-text-muted">
              You can upgrade later: Starter → Basic → Standard → Professional → Enterprise.
            </p>
          </Section>
        ) : null}

        <SoftwareProductFaq faqs={faqs} className="mt-10 lg:mt-14" />

        <MaturityUpgradePath productSlug={project.slug} />

        <section className="mt-10 rounded-2xl border border-border-subtle bg-surface px-5 py-6 lg:mt-14 sm:px-6">
          <h2 className="font-display text-xl font-black text-text-primary">Ready to proceed?</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {selectedPackage
              ? `Request a demo or order ${packageDisplayName(selectedPackage)} with exact pricing.`
              : 'Request a free demo or talk to our team.'}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => openLead('demo')}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-border-subtle px-4 py-3 text-sm font-semibold"
            >
              Free Demo
            </button>
            <button
              type="button"
              onClick={() => openLead('order')}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#0f2744] px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-[#0f2744]"
            >
              {orderLabel}
            </button>
          </div>
        </section>

        <div className="mt-10">
          <ProductReviews
            kind="software"
            productId={project.id}
            initialReviews={reviews}
            ratingAvg={ratingAvg}
            reviewCount={reviewCount}
          />
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface/95 px-4 py-3 backdrop-blur lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black tabular-nums text-text-primary">
              {formatCatalogPrice(displayPrice, { currency: displayCurrency })}
            </p>
            <p className="truncate text-xs text-text-muted">
              {selectedPackage ? packageDisplayName(selectedPackage) : 'Software'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openLead('demo')}
            className="rounded-xl border border-border-subtle px-3 py-2.5 text-xs font-semibold"
          >
            Free Demo
          </button>
          <button
            type="button"
            onClick={() => openLead('order')}
            className="rounded-xl bg-[#0f2744] px-3 py-2.5 text-xs font-semibold text-white dark:bg-white dark:text-[#0f2744]"
          >
            Order
          </button>
        </div>
      </div>

      {selectedPackage ? (
        <SoftwarePackageLeadModal
          open={leadOpen}
          onClose={() => setLeadOpen(false)}
          intent={leadIntent}
          projectId={project.id}
          productSlug={project.slug}
          productTitle={project.title}
          selectedPackage={selectedPackage}
        />
      ) : null}

      {viewAllOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="mx-auto flex max-h-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <h3 className="font-display text-lg font-bold">All screens</h3>
              <button type="button" onClick={() => setViewAllOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-3">
              {screens.map((screen) => {
                const thumb = screenThumbUrl(screen, assetVersion);
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
                      <img src={thumb} alt="" className="aspect-video w-full object-cover" />
                    ) : null}
                    <span className="block truncate px-2 py-1.5 text-xs font-medium">{screenLabel(screen)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {fullscreen && imageUrl ? (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-xl bg-white/10 p-2 text-white"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      ) : null}
    </div>
  );
}

export function SoftwarePreviewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading software">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="h-3 w-24 animate-pulse rounded bg-background-soft" />
          <div className="mt-3 h-9 w-2/3 animate-pulse rounded bg-background-soft" />
          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-background-soft" />
          <div className="mt-6 h-8 w-40 animate-pulse rounded bg-background-soft" />
          <div className="mt-5 flex gap-2">
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-background-soft" />
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-background-soft" />
          </div>
        </div>
        <div className="aspect-card w-full animate-pulse rounded-2xl bg-background-soft" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[4.5rem] animate-pulse rounded-2xl bg-background-soft" />
        ))}
      </div>
      <div className="mt-6 h-48 animate-pulse rounded-2xl bg-background-soft" />
      <div className="mt-10 aspect-[16/10] animate-pulse rounded-2xl bg-background-soft" />
    </div>
  );
}
