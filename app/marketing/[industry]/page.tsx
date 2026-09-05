import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { SITE_URL } from '@/lib/site';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import {
  CatalogAnalytics,
  CatalogFaqList,
  ExploreCatalogLayout,
  buildIndustryBreadcrumbs,
  buildIndustryMetadata,
  getIndustryByPath,
  industryPath,
  listFaqs,
  listIndustries,
  lookupRedirect,
  productPath,
} from '@/src/features/catalog';
import { CATALOG_LISTING_GRID_CLASS } from '@/src/features/catalog/components/explore/types';
import { listCreativeMarketingCards } from '@/src/features/creative-marketing-showcase/api/projects';
import { CREATIVE_MARKETING_GALLERY_PAGE_SIZE } from '@/src/features/creative-marketing-showcase/config/constants';
import { CreativeMarketingCatalog } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCatalog';
import { creativeMarketingListingQueryKey } from '@/src/features/creative-marketing-showcase/utils/query-keys';
import { CreativeMarketingCardSkeleton } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCard';

export const revalidate = 60;

type Props = {
  params: Promise<{ industry: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export async function generateMetadata({ params }: Props) {
  const { industry: industrySlug } = await params;
  const industry = await getIndustryByPath('marketing', industrySlug);
  if (!industry) {
    return buildPageMetadata({
      title: 'Marketing industry',
      path: industryPath('marketing', industrySlug),
    });
  }
  const meta = buildIndustryMetadata('marketing', industry);
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: meta.canonicalPath,
  });
}

export default async function MarketingIndustryPage({ params, searchParams }: Props) {
  const { industry: industrySlug } = await params;
  const sp = await searchParams;
  const industry = await getIndustryByPath('marketing', industrySlug);

  if (!industry) {
    const redir = await lookupRedirect(`/marketing/${industrySlug}`);
    if (redir?.to_path) redirect(redir.to_path);
    const legacy = await lookupRedirect(`/creative-marketing/${industrySlug}`);
    if (legacy?.to_path) redirect(legacy.to_path);
    notFound();
  }

  const q = first(sp.q).trim();
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const [result, faqs, industries] = await Promise.all([
    listCreativeMarketingCards({
      q: q || undefined,
      industrySlug: industry.slug,
      page,
      pageSize: CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
    }),
    listFaqs({ industryId: industry.id }),
    listIndustries('marketing'),
  ]);

  const crumbs = buildIndustryBreadcrumbs('marketing', industry);
  const h1 = industry.seo_h1?.trim() || industry.name;
  const intro =
    industry.seo_intro?.trim() ||
    industry.description?.trim() ||
    industry.short_description?.trim() ||
    `${industry.name} creative and marketing services from Bridge IT Park.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h1,
    description: intro,
    url: `${SITE_URL}${industryPath('marketing', industry.slug)}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: result.total,
      itemListElement: result.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${item.canonical_path || productPath('marketing', industry.slug, item.slug)}`,
        name: item.title,
      })),
    },
  };

  const sidebarIndustries = industries.map((i) => ({ slug: i.slug, name: i.name }));

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: STALE_PUBLIC_LISTING } },
  });
  queryClient.setQueryData(
    creativeMarketingListingQueryKey({
      q,
      group: 'all',
      more: [],
      page,
      pageSize: CREATIVE_MARKETING_GALLERY_PAGE_SIZE,
      industrySlug: industry.slug,
    }),
    result
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <CatalogAnalytics
        payload={{
          event: 'catalog_industry_view',
          category_root: 'marketing',
          industry: industry.slug,
        }}
      />
      <ExploreCatalogLayout
        activeRoot="marketing"
        activeIndustrySlug={industry.slug}
        industries={sidebarIndustries}
        breadcrumbs={crumbs}
        title={h1}
        description={intro}
        resultCount={result.total}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className={CATALOG_LISTING_GRID_CLASS}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <CreativeMarketingCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <CreativeMarketingCatalog
              initialFilters={{ q, page, industrySlug: industry.slug }}
              initialData={result}
              hideChrome
              lockedIndustrySlug={industry.slug}
            />
          </Suspense>
        </HydrationBoundary>
        <CatalogFaqList faqs={faqs} />
      </ExploreCatalogLayout>
    </>
  );
}
