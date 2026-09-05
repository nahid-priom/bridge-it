import { Suspense } from 'react';
import Link from 'next/link';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { buildPageMetadata } from '@/lib/metadata';
import { listingHasSeoFilters } from '@/lib/seo/listing-index';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/routes';
import { STALE_PUBLIC_LISTING } from '@/lib/query/client';
import {
  CatalogAnalytics,
  ExploreCatalogLayout,
  buildCategoryBreadcrumbs,
  listIndustries,
  parseSoftwarePriceParam,
  productPath,
  softwarePriceBounds,
  industryPath,
} from '@/src/features/catalog';
import {
  parseSoftwareBusinessSizeParam,
  parseSoftwareSortParam,
} from '@/src/features/catalog/components/explore/types';
import { SOFTWARE_HUB_PRIORITY_SLUGS } from '@/src/features/catalog/config/software-industries-45';
import { listSoftwareProjectCards } from '@/src/features/software-showcase/api/projects';
import {
  parseSoftwareGroupParam,
  parseSoftwareMoreParam,
  primaryFilterToTaxonomySlug,
  SOFTWARE_GALLERY_PAGE_SIZE,
  SOFTWARE_PRIMARY_FILTERS,
} from '@/src/features/software-showcase/config/constants';
import { SoftwareCatalog } from '@/src/features/software-showcase/public/SoftwareCatalog';
import { softwareListingQueryKey } from '@/src/features/software-showcase/utils/query-keys';

export const revalidate = 60;

const PAGE_TITLE = 'Business Software & ERP Solutions';
const PAGE_DESCRIPTION =
  'Industry ERP, POS, CRM and HR tools with clear one-time packages — built for Bangladesh operations.';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const noIndex = listingHasSeoFilters({
    q: first(sp.q),
    page: first(sp.page),
    filters: [
      first(sp.group),
      first(sp.solutionGroup),
      first(sp.category),
      first(sp.child),
      first(sp.more),
      first(sp.price),
      first(sp.size),
      first(sp.sort),
    ],
  });
  return buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: ROUTES.softwareShowroom,
    keywords: [
      'business software solutions Bangladesh',
      'ERP software Bangladesh',
      'business management software',
      'POS software Bangladesh',
      'CRM software for small business',
      'HR payroll software Bangladesh',
    ],
    noIndex,
  });
}

export default async function SoftwareShowroomPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q).trim();
  const group = parseSoftwareGroupParam(first(sp.group), first(sp.solutionGroup));
  const categoryRaw = first(sp.category).trim();
  const child = first(sp.child).trim() || 'all';
  const more = parseSoftwareMoreParam(first(sp.more));
  const page = Math.max(1, Number(first(sp.page)) || 1);
  const priceId = parseSoftwarePriceParam(first(sp.price));
  const priceBounds = softwarePriceBounds(priceId);
  const businessSizes = parseSoftwareBusinessSizeParam(first(sp.size));
  const sort = parseSoftwareSortParam(first(sp.sort));

  const primaryIds = new Set(SOFTWARE_PRIMARY_FILTERS.map((f) => f.id));
  let category = 'all';
  let taxonomyCategory: string | undefined;
  if (categoryRaw && categoryRaw !== 'all') {
    if (primaryIds.has(categoryRaw as (typeof SOFTWARE_PRIMARY_FILTERS)[number]['id'])) {
      category = categoryRaw;
      taxonomyCategory = primaryFilterToTaxonomySlug(categoryRaw);
    } else {
      const byTax = SOFTWARE_PRIMARY_FILTERS.find((f) => f.taxonomySlug === categoryRaw);
      category = byTax?.id ?? categoryRaw;
      taxonomyCategory = categoryRaw;
    }
  } else if (group !== 'all') {
    category = group;
    taxonomyCategory = primaryFilterToTaxonomySlug(group);
  }

  const [result, industries] = await Promise.all([
    listSoftwareProjectCards({
      q: q || undefined,
      taxonomyCategory,
      child: child === 'all' ? undefined : child,
      group: group === 'all' ? undefined : group,
      more: more.length ? more : undefined,
      page,
      pageSize: SOFTWARE_GALLERY_PAGE_SIZE,
      minPrice: priceBounds.minPrice,
      maxPrice: priceBounds.maxPrice,
      businessSizes: businessSizes.length ? businessSizes : undefined,
      sort,
    }),
    listIndustries('software'),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}${ROUTES.softwareShowroom}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: result.total,
      itemListElement: result.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${
          item.canonical_path ||
          (item.industry_slug
            ? productPath('software', item.industry_slug, item.slug)
            : ROUTES.softwareSolution(item.slug))
        }`,
        name: item.title,
      })),
    },
  };

  const sidebarIndustries = industries.map((i) => ({ slug: i.slug, name: i.name }));
  const popular = SOFTWARE_HUB_PRIORITY_SLUGS.map((slug) =>
    industries.find((i) => i.slug === slug)
  ).filter(Boolean) as typeof industries;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: STALE_PUBLIC_LISTING } },
  });
  queryClient.setQueryData(
    softwareListingQueryKey({
      q,
      category: category || 'all',
      child: child === 'all' ? 'all' : child,
      more,
      page,
      pageSize: SOFTWARE_GALLERY_PAGE_SIZE,
      industrySlug: '',
      price: priceId ?? '',
      size: businessSizes.length ? businessSizes.join(',') : '',
      sort,
    }),
    result
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageBreadcrumbJsonLd path={ROUTES.softwareShowroom} />
      <CatalogAnalytics
        payload={{
          event: 'catalog_category_view',
          category_root: 'software',
          software_hub_view: true,
        }}
      />
      <ExploreCatalogLayout
        activeRoot="software"
        industries={sidebarIndustries}
        breadcrumbs={buildCategoryBreadcrumbs('software')}
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        resultCount={result.total}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* Suspense required for useSearchParams; null avoids stacked grid skeletons */}
          <Suspense fallback={null}>
            <SoftwareCatalog
              initialFilters={{
                q,
                category,
                group,
                child,
                more,
                page,
                price: priceId ?? '',
                size: businessSizes.length ? businessSizes.join(',') : '',
                sort,
              }}
              initialData={result}
              hideChrome
            />
          </Suspense>
        </HydrationBoundary>

        {popular.length > 0 ? (
          <section className="mt-12 border-t border-border-subtle pt-8" aria-labelledby="browse-industries">
            <h2 id="browse-industries" className="font-display text-lg font-bold text-[#0f2744] dark:text-white">
              Browse industries
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Dedicated industry catalogs for SEO and focused discovery.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {popular.map((industry) => (
                <li key={industry.id}>
                  <Link
                    href={industryPath('software', industry.slug)}
                    className="inline-flex rounded-lg border border-border-subtle px-3 py-1.5 text-sm font-medium text-text-secondary hover:border-[#2563eb]/40 hover:text-text-primary"
                  >
                    {industry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </ExploreCatalogLayout>
    </>
  );
}
