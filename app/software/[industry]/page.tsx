import { Suspense } from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { listingHasSeoFilters } from '@/lib/seo/listing-index';
import { JsonLd } from '@/components/layout/JsonLd';
import { SITE_URL } from '@/lib/site';
import {
  CatalogAnalytics,
  CatalogFaqList,
  ExploreCatalogLayout,
  buildIndustryBreadcrumbs,
  categoryPath,
  getIndustryByPath,
  industryPath,
  listFaqs,
  listIndustries,
  lookupRedirect,
  parseSoftwarePriceParam,
  productPath,
  softwarePriceBounds,
} from '@/src/features/catalog';
import {
  parseSoftwareBusinessSizeParam,
  parseSoftwareSortParam,
} from '@/src/features/catalog/components/explore/types';
import { listSoftwareProjectCards } from '@/src/features/software-showcase/api/projects';
import { SOFTWARE_GALLERY_PAGE_SIZE } from '@/src/features/software-showcase/config/constants';
import { specializedSlugsForIndustry } from '@/src/features/software-showcase/config/specialized-solutions';
import { SoftwareCatalog } from '@/src/features/software-showcase/public/SoftwareCatalog';
import { SoftwareCardSkeleton } from '@/src/features/software-showcase/public/SoftwareCard';
import { MaturityCompareBlock } from '@/src/features/software-showcase/public/MaturityCompareBlock';
import { MaturityPackagesSection } from '@/src/features/software-showcase/public/MaturityPackagesSection';
import { SpecializedSolutionsSection } from '@/src/features/software-showcase/public/SpecializedSolutionsSection';

export const revalidate = 60;

type Props = {
  params: Promise<{ industry: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function shortIntro(industryName: string, slug: string, fallback?: string | null): string {
  const trimmed = fallback?.trim();
  if (trimmed && trimmed.length <= 160) return trimmed;
  if (slug === 'manufacturing') {
    return 'ERP and production software for manufacturing businesses.';
  }
  if (slug === 'feed-mill') {
    return 'Feed mill ERP and inventory software for production and stock control.';
  }
  if (slug === 'garments') {
    return 'Garments ERP and apparel production software for Bangladesh factories.';
  }
  return `${industryName} software and ERP solutions for growing businesses.`;
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { industry: industrySlug } = await params;
  const sp = await searchParams;
  const industry = await getIndustryByPath('software', industrySlug);
  if (!industry) {
    return buildPageMetadata({
      title: 'Software industry',
      path: industryPath('software', industrySlug),
    });
  }

  const title =
    industry.seo_title?.trim() || `${industry.name} Software & ERP Solutions | Bridge IT Park`;
  const description =
    industry.seo_description?.trim() ||
    shortIntro(industry.name, industry.slug, industry.short_description);

  const resultPreview = await listSoftwareProjectCards({
    industrySlug: industry.slug,
    page: 1,
    pageSize: 1,
  });
  const empty = resultPreview.total === 0;
  const noIndex =
    empty ||
    listingHasSeoFilters({
      q: first(sp.q),
      page: first(sp.page),
      filters: [first(sp.price), first(sp.size), first(sp.sort)],
    });

  return buildPageMetadata({
    title,
    description,
    path: industryPath('software', industry.slug),
    keywords: [
      `${industry.name} software`,
      `${industry.name} ERP`,
      `${industry.name} management software`,
      'business software Bangladesh',
    ],
    noIndex,
  });
}

export default async function SoftwareIndustryPage({ params, searchParams }: Props) {
  const { industry: industrySlug } = await params;
  const sp = await searchParams;
  const industry = await getIndustryByPath('software', industrySlug);

  if (!industry) {
    const redir = await lookupRedirect(`/software/${industrySlug}`);
    if (redir?.to_path) {
      redirect(redir.to_path);
    }
    notFound();
  }

  const q = first(sp.q).trim();
  const page = Math.max(1, Number(first(sp.page)) || 1);
  const priceId = parseSoftwarePriceParam(first(sp.price));
  const priceBounds = softwarePriceBounds(priceId);
  const businessSizes = parseSoftwareBusinessSizeParam(first(sp.size));
  const sort = parseSoftwareSortParam(first(sp.sort));

  const [result, faqs, industries] = await Promise.all([
    listSoftwareProjectCards({
      q: q || undefined,
      industrySlug: industry.slug,
      page,
      pageSize:
        industry.slug === 'garments' || industry.slug === 'feed-mill'
          ? Math.max(SOFTWARE_GALLERY_PAGE_SIZE, 24)
          : SOFTWARE_GALLERY_PAGE_SIZE,
      minPrice: priceBounds.minPrice,
      maxPrice: priceBounds.maxPrice,
      businessSizes: businessSizes.length ? businessSizes : undefined,
      sort,
    }),
    listFaqs({ industryId: industry.id }),
    listIndustries('software'),
  ]);

  const crumbs = buildIndustryBreadcrumbs('software', industry);
  const h1 = industry.seo_h1?.trim() || `${industry.name} Software`;
  const intro = shortIntro(
    industry.name,
    industry.slug,
    industry.seo_intro || industry.short_description
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h1,
    description: intro,
    url: `${SITE_URL}${industryPath('software', industry.slug)}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: result.total,
      itemListElement: result.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${item.canonical_path || productPath('software', industry.slug, item.slug)}`,
        name: item.title,
      })),
    },
  };

  const sidebarIndustries = industries.map((i) => ({ slug: i.slug, name: i.name }));
  const aboutBody =
    industry.description?.trim() ||
    industry.seo_intro?.trim() ||
    `${industry.name} software helps Bangladesh businesses run operations with clearer inventory, production, and reporting — without monthly SaaS lock-in.`;

  const isLadderIndustry = industry.slug === 'garments' || industry.slug === 'feed-mill';
  const hasActiveFilters = Boolean(q || priceId || businessSizes.length || (sort && sort !== 'popular'));
  const specializedSlugs = specializedSlugsForIndustry(industry.slug);
  const useSectionedListing = isLadderIndustry && !hasActiveFilters && page === 1;

  return (
    <>
      <JsonLd data={jsonLd} />
      <CatalogAnalytics
        payload={{
          event: 'catalog_industry_view',
          category_root: 'software',
          industry: industry.slug,
          industry_view: true,
        }}
      />
      <ExploreCatalogLayout
        activeRoot="software"
        activeIndustrySlug={industry.slug}
        industries={sidebarIndustries}
        breadcrumbs={crumbs}
        title={h1}
        description={intro}
        resultCount={result.total}
      >
        {useSectionedListing ? (
          <>
            <MaturityPackagesSection industrySlug={industry.slug} products={result.items} />
            <MaturityCompareBlock industrySlug={industry.slug} products={result.items} />
            <SpecializedSolutionsSection industrySlug={industry.slug} products={result.items} />
          </>
        ) : (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SoftwareCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <SoftwareCatalog
              initialFilters={{
                q,
                page,
                price: priceId ?? '',
                size: businessSizes.length ? businessSizes.join(',') : '',
                sort,
                industrySlug: industry.slug,
              }}
              initialData={result}
              hideChrome
              lockedIndustrySlug={industry.slug}
            />
          </Suspense>
        )}

        {!useSectionedListing && isLadderIndustry ? (
          <MaturityCompareBlock industrySlug={industry.slug} products={result.items} />
        ) : null}

        <section className="mt-12 max-w-3xl border-t border-border-subtle pt-8" aria-labelledby="about-industry">
          <h2 id="about-industry" className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
            About {industry.name} Software
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{aboutBody}</p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Browse published solutions above, then open a product page to compare packages, request a free
            demo, or place an order.
            {specializedSlugs.length
              ? ' Specialized tools sit alongside complete ERP packages for focused departments.'
              : null}
          </p>
        </section>

        <CatalogFaqList faqs={faqs} />

        <p className="mt-8 text-sm">
          <Link
            href={categoryPath('software')}
            className="font-semibold text-[#2563eb] hover:underline"
          >
            ← All software solutions
          </Link>
        </p>
      </ExploreCatalogLayout>
    </>
  );
}
