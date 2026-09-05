'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/routes';
import { ProductReviews } from '@/src/features/catalog/components/ProductReviews';
import { StarRating } from '@/src/features/catalog/components/StarRating';
import { fallbackRatingFromSlug } from '@/src/features/catalog/types/reviews';
import { softwareIndustryForProduct } from '@/src/features/catalog/config/software-industry-map';
import type { CatalogFaq } from '@/src/features/catalog/types';
import type { CatalogProductReview } from '@/src/features/catalog/types/reviews';
import type { SoftwarePackage, SoftwareProjectDetail } from '../types';
import { PackageFeatureAccordion } from './PackageFeatureAccordion';
import { ProjectScreenGallery } from './ProjectScreenGallery';
import { SoftwarePackageLeadModal } from './SoftwarePackageLeadModal';
import { SoftwarePackageSelector } from './SoftwarePackageSelector';
import { SoftwareProductFaq } from './SoftwareProductFaq';
import { SoftwareEmptyPreview } from './SoftwareEmptyPreview';
import {
  includedFeatureRows,
  manageCardsFromPackage,
  screensForPackage,
} from './package-features';
import { packageDisplayName, pickDefaultPackage } from './package-utils';

function Section({ title, children }: { title: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <section className="mt-10 max-w-4xl lg:mt-14">
      <h2 className="mb-3 font-display text-xl font-black text-text-primary md:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function ManageChips({
  labels,
  features,
}: {
  labels: string[];
  features: SoftwareProjectDetail['features'];
}) {
  if (labels.length > 0) {
    return (
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {labels.map((label) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-[0.8125rem] font-semibold text-text-primary sm:text-sm"
          >
            <Check className="h-4 w-4 shrink-0 text-bridge-primary" aria-hidden />
            <span className="min-w-0 leading-snug">{label}</span>
          </li>
        ))}
      </ul>
    );
  }
  const primary = features.filter((f) => f.is_primary).slice(0, 6);
  const items = primary.length > 0 ? primary : features.slice(0, 6);
  if (items.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-2 sm:gap-2.5">
      {items.map((feature) => (
        <li
          key={feature.id}
          className="rounded-xl border border-border-subtle bg-surface px-3 py-2.5 sm:px-3.5 sm:py-3"
        >
          <p className="text-[0.9375rem] font-semibold leading-snug text-text-primary sm:text-base">
            {feature.title}
          </p>
        </li>
      ))}
    </ul>
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

  useEffect(() => {
    if (activePackages.length === 0) return;
    const fromUrl = searchParams.get('package');
    const next = pickDefaultPackage(activePackages, fromUrl);
    if (!next) return;
    setSelectedPackage((prev) => (prev?.id === next.id ? prev : next));
  }, [activePackages, searchParams]);

  const [leadOpen, setLeadOpen] = useState(false);
  const [leadIntent, setLeadIntent] = useState<'demo' | 'order'>('order');

  const openLead = useCallback(
    (intent: 'demo' | 'order') => {
      if (hasPackages && !selectedPackage) return;
      setLeadIntent(intent);
      setLeadOpen(true);
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: intent === 'demo' ? 'free_demo_click' : 'order_click',
          category_root: 'software',
          product: project.slug,
          package: selectedPackage?.name,
          package_tier: selectedPackage?.tier,
        });
      }
    },
    [hasPackages, project.slug, selectedPackage]
  );

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

  const syncScreenUrl = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get('screen') === key) return;
      params.set('screen', key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const categoryLabel =
    project.taxonomy_category?.name ??
    project.child_category?.name ??
    project.category?.name ??
    'Software';
  const outcome = project.feature_summary ?? project.short_description;
  const manageLabels = manageCardsFromPackage(selectedPackage);
  const heroFeatureLabels =
    manageLabels.length > 0
      ? manageLabels.slice(0, 6)
      : includedFeatureRows(selectedPackage)
          .slice(0, 6)
          .map((f) => f.label);

  const industrySlug =
    softwareIndustryForProduct(project.slug) ||
    (project as { industry_slug?: string | null }).industry_slug;
  const breadcrumbSoftwareHref = industrySlug
    ? ROUTES.softwareIndustry(industrySlug)
    : ROUTES.softwareShowroom;

  return (
    <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-16">
      <div className="mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 lg:pt-[calc(var(--header-offset)+1rem)] xl:px-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-text-muted sm:text-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href={ROUTES.home} className="hover:text-text-primary hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={ROUTES.explore} className="hover:text-text-primary hover:underline">
                Portfolio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={breadcrumbSoftwareHref} className="hover:text-text-primary hover:underline">
                Software
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="truncate font-medium text-text-secondary">{project.title}</li>
          </ol>
        </nav>

        {/* Hero — no price (pricing lives in packages below gallery) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
          <header className="min-w-0">
            <span className="inline-flex rounded-full bg-bridge-primary/10 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-bridge-primary">
              {categoryLabel}
            </span>
            <h1 className="mt-2 font-display text-[1.625rem] font-black leading-tight text-text-primary sm:text-3xl lg:text-[2.125rem]">
              {project.title}
            </h1>
            <StarRating rating={ratingAvg} reviewCount={reviewCount} size="md" className="mt-2" />
            {outcome ? (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
                {outcome}
              </p>
            ) : null}

            {heroFeatureLabels.length > 0 ? (
              <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {heroFeatureLabels.map((label) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-sm font-medium text-text-secondary"
                  >
                    <Check className="h-4 w-4 shrink-0 text-bridge-primary" aria-hidden />
                    <span className="min-w-0">{label}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => openLead('demo')}
                disabled={hasPackages && !selectedPackage}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-bridge-primary px-4 py-3 text-sm font-semibold text-white hover:bg-bridge-primary-dark disabled:opacity-50"
              >
                Request Free Demo
              </button>
              <button
                type="button"
                onClick={() => openLead('order')}
                disabled={hasPackages && !selectedPackage}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border-subtle px-4 py-3 text-sm font-semibold text-text-primary hover:border-bridge-primary/40 disabled:opacity-50"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Talk to Our Expert
              </button>
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted sm:text-sm">
              {['Free consultation', 'No hidden cost', 'Customizable'].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-bridge-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </header>

          <div className="min-w-0 lg:pt-1">
            {screens.length > 0 ? (
              <ProjectScreenGallery
                screens={screens}
                assetVersion={assetVersion}
                productTitle={project.title}
                selectedKey={screenFromUrl ?? undefined}
                onSelectKey={syncScreenUrl}
              />
            ) : (
              <SoftwareEmptyPreview
                title="Screens coming soon"
                description="Premium screenshots are being prepared. Request a free demo to see the live system."
              />
            )}
          </div>
        </div>

        {/* Packages below visual showcase */}
        <Section title="What this software manages">
          <ManageChips labels={manageLabels} features={features} />
        </Section>

        {hasPackages ? (
          <div className="mt-10 lg:mt-14">
            <SoftwarePackageSelector
              packages={activePackages}
              productSlug={project.slug}
              value={selectedPackage}
              onChange={setSelectedPackage}
            />
            {selectedPackage ? (
              <PackageFeatureAccordion
                className="mt-4"
                pkg={selectedPackage}
                onDemo={() => openLead('demo')}
                onOrder={() => openLead('order')}
              />
            ) : null}
          </div>
        ) : null}

        <SoftwareProductFaq faqs={faqs} className="mt-10 lg:mt-14" />

        <section className="mt-10 rounded-2xl border border-border-subtle bg-surface px-5 py-6 lg:mt-14 sm:px-6">
          <h2 className="font-display text-xl font-black text-text-primary">Ready for a free demo?</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {selectedPackage
              ? `See ${packageDisplayName(selectedPackage)} in action, or talk to a consultant.`
              : 'See how this software fits your business — no obligation.'}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => openLead('demo')}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-bridge-primary px-4 py-3 text-sm font-semibold text-white"
            >
              Request Free Demo
            </button>
            <Link
              href={ROUTES.contact}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-border-subtle px-4 py-3 text-sm font-semibold text-text-primary"
            >
              Contact Us
            </Link>
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

      {/* Sticky mobile CTA — demo/contact only (no price dominance) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface/95 px-4 py-3 backdrop-blur lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            onClick={() => openLead('demo')}
            className="min-h-11 flex-1 rounded-xl bg-bridge-primary px-3 py-2.5 text-sm font-semibold text-white"
          >
            Free Demo
          </button>
          <button
            type="button"
            onClick={() => openLead('order')}
            className="min-h-11 flex-1 rounded-xl border border-border-subtle px-3 py-2.5 text-sm font-semibold"
          >
            Talk to Expert
          </button>
        </div>
      </div>

      {leadOpen ? (
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
    </div>
  );
}

export { SoftwarePreviewSkeleton } from './SoftwarePreviewSkeleton';
