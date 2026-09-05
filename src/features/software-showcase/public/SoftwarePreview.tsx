'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductReviews } from '@/src/features/catalog/components/ProductReviews';
import { softwareIndustryForProduct } from '@/src/features/catalog/config/software-industry-map';
import type { CatalogFaq } from '@/src/features/catalog/types';
import type { CatalogProductReview } from '@/src/features/catalog/types/reviews';
import type { SoftwarePackage, SoftwareProjectDetail } from '../types';
import { ImportantFeatureGrid } from './ImportantFeatureGrid';
import { PackageFeatureAccordion } from './PackageFeatureAccordion';
import { ProjectScreenGallery } from './ProjectScreenGallery';
import { SoftwarePackageLeadModal } from './SoftwarePackageLeadModal';
import { SoftwarePackageSelector } from './SoftwarePackageSelector';
import { SoftwareProductFaq } from './SoftwareProductFaq';
import { SoftwareEmptyPreview } from './SoftwareEmptyPreview';
import { SoftwareDetailsHero } from './SoftwareDetailsHero';
import { StickyProductCTA } from './StickyProductCTA';
import { TrustPoints } from './TrustPoints';
import { screensForPackage } from './package-features';
import { pickDefaultPackage } from './package-utils';

export function SoftwarePreview({
  project,
  reviews = [],
  faqs = [],
}: {
  project: SoftwareProjectDetail;
  reviews?: CatalogProductReview[];
  faqs?: CatalogFaq[];
}) {
  // Real ratings only — never fabricate for listing/detail SEO.
  const ratingAvg = project.rating_avg ?? null;
  const reviewCount = project.review_count ?? null;
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
  const features = useMemo(() => {
    const fromDb = project.features
      .filter((f) => f.published)
      .sort((a, b) => a.sort_order - b.sort_order);
    if (fromDb.length > 0) return fromDb;
    const modules = project.modules ?? [];
    return modules.slice(0, 8).map((title, index) => ({
      id: `module-${index}-${title}`,
      project_id: project.id,
      title,
      short_description: null,
      icon_key: null,
      sort_order: (index + 1) * 10,
      is_primary: index < 4,
      published: true,
      created_at: '',
      updated_at: '',
      deleted_at: null,
    }));
  }, [project.features, project.id, project.modules]);

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
  /** Prefer SEO / full copy on the detail hero; short blurb is for listing cards only. */
  const heroDescription =
    project.seo_description?.trim() ||
    project.full_description?.trim() ||
    project.feature_summary?.trim() ||
    project.short_description?.trim() ||
    null;
  const industrySlug =
    softwareIndustryForProduct(project.slug) ||
    (project as { industry_slug?: string | null }).industry_slug;
  const ctaDisabled = hasPackages && !selectedPackage;

  const gallery =
    screens.length > 0 ? (
      <ProjectScreenGallery
        screens={screens}
        assetVersion={assetVersion}
        productTitle={project.title}
        selectedKey={screenFromUrl ?? undefined}
        onSelectKey={syncScreenUrl}
        heroMode
      />
    ) : (
      <SoftwareEmptyPreview
        title="Screens coming soon"
        description="Premium screenshots are being prepared. Talk to an expert to see the live system."
      />
    );

  return (
    <div className="overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-16">
      <main className="mx-auto w-full max-w-[1480px] px-4 pt-[calc(var(--header-offset)+0.75rem)] sm:px-6 lg:px-8 lg:pt-[calc(var(--header-offset)+1rem)] xl:px-10">
        {/*
          Mobile: identity → gallery → features → trust → packages
          Desktop: identity+CTA | gallery, then features / packages below
        */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-10">
          <SoftwareDetailsHero
            categoryLabel={categoryLabel}
            title={project.title}
            ratingAvg={ratingAvg}
            reviewCount={reviewCount}
            description={heroDescription}
            industrySlug={industrySlug}
            onOrder={() => openLead('order')}
            onTalk={() => openLead('demo')}
            ctaDisabled={ctaDisabled}
            showCtas
          />
          <div className="min-w-0 lg:flex lg:h-full lg:flex-col lg:pt-1">{gallery}</div>
        </div>

        <ImportantFeatureGrid features={features} className="mt-8 lg:mt-12" />

        <TrustPoints className="mt-5 lg:mt-6" />

        {hasPackages ? (
          <div className="mt-8 lg:mt-12" id="packages">
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

        <SoftwareProductFaq faqs={faqs} className="mt-8 lg:mt-14" />

        <div className="mt-8 lg:mt-10">
          <ProductReviews
            kind="software"
            productId={project.id}
            initialReviews={reviews}
            ratingAvg={ratingAvg ?? 0}
            reviewCount={reviewCount ?? 0}
          />
        </div>
      </main>

      <StickyProductCTA
        onOrder={() => openLead('order')}
        onTalk={() => openLead('demo')}
        disabled={ctaDisabled}
      />

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
