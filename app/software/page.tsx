import { Suspense } from 'react';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { listingHasSeoFilters } from '@/lib/seo/listing-index';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/routes';
import {
  CatalogAnalytics,
  CatalogProductCard,
  IndustryGrid,
  listIndustries,
  listProducts,
  productPath,
} from '@/src/features/catalog';
import {
  SOFTWARE_HUB_PRIORITY_SLUGS,
} from '@/src/features/catalog/config/software-industries-45';
import {
  listShowcaseTaxonomy,
  listSoftwareProjectCards,
} from '@/src/features/software-showcase/api/projects';
import {
  parseSoftwareGroupParam,
  parseSoftwareMoreParam,
  primaryFilterToTaxonomySlug,
  SOFTWARE_GALLERY_PAGE_SIZE,
  SOFTWARE_PRIMARY_FILTERS,
} from '@/src/features/software-showcase/config/constants';
import { SoftwareCatalog } from '@/src/features/software-showcase/public/SoftwareCatalog';
import { SoftwareCardSkeleton } from '@/src/features/software-showcase/public/SoftwareCard';

export const revalidate = 60;

const PAGE_TITLE = 'Business Software & ERP Solutions';
const PAGE_DESCRIPTION =
  'Industry-focused ERP and business software for growing companies — compare packages, request a free demo, and order a scoped implementation.';

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
    filters: [first(sp.group), first(sp.solutionGroup), first(sp.category), first(sp.child), first(sp.more)],
  });
  return buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: ROUTES.softwareShowroom,
    keywords: [
      'software solutions Bangladesh',
      'custom software development',
      'POS software Bangladesh',
      'CRM software for small business',
      'HR payroll software Bangladesh',
      'business automation software',
      'SaaS development',
      'mobile business app development',
    ],
    noIndex,
  });
}

function CatalogFallback() {
  return (
    <div
      className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading software"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <SoftwareCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default async function SoftwareShowroomPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q).trim();
  const group = parseSoftwareGroupParam(first(sp.group), first(sp.solutionGroup));
  const categoryRaw = first(sp.category).trim();
  const child = first(sp.child).trim() || 'all';
  const more = parseSoftwareMoreParam(first(sp.more));
  const page = Math.max(1, Number(first(sp.page)) || 1);

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

  const [result, taxonomy, industries, featured] = await Promise.all([
    listSoftwareProjectCards({
      q: q || undefined,
      taxonomyCategory,
      child: child === 'all' ? undefined : child,
      group: group === 'all' ? undefined : group,
      more: more.length ? more : undefined,
      page,
      pageSize: SOFTWARE_GALLERY_PAGE_SIZE,
    }),
    listShowcaseTaxonomy(),
    listIndustries('software'),
    listProducts({ root: 'software', featured: true, pageSize: 8 }),
  ]);

  const bySlug = new Map(industries.map((i) => [i.slug, i]));
  const popularIndustries = SOFTWARE_HUB_PRIORITY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    Boolean
  ) as typeof industries;

  const businessNeedIndustries = industries.filter(
    (i) => i.taxonomy_type === 'business_function'
  );

  const softwareMain = taxonomy.mains.find((m) => m.slug === 'software');
  const softwareCats = taxonomy.categories.filter((c) => c.main_category_id === softwareMain?.id);
  const catById = new Map(softwareCats.map((c) => [c.id, c]));
  const childOptions = taxonomy.children
    .filter((ch) => catById.has(ch.category_id))
    .map((ch) => ({
      id: ch.id,
      label: ch.name,
      slug: ch.slug,
      categorySlug: catById.get(ch.category_id)?.slug,
    }));

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
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-0 sm:px-6 lg:px-8 xl:px-10">
        <header className="mb-4 md:mb-6">
          <h1 className="font-display text-2xl font-black tracking-tight text-[#0f2744] dark:text-white sm:text-3xl md:text-4xl">
            Business Software & ERP Solutions
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-text-secondary md:text-base">
            Industry ERP, POS, CRM and HR tools with clear one-time packages — built for Bangladesh operations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="#popular-industries"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0f2744] px-4 text-sm font-semibold text-white hover:bg-[#16375f]"
            >
              Browse Industries
            </a>
            <Link
              href={ROUTES.consultation}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border-subtle px-4 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
            >
              Free Demo
            </Link>
          </div>
        </header>

        {popularIndustries.length > 0 ? (
          <section
            id="popular-industries"
            className="mb-8 md:mb-10"
            aria-labelledby="software-popular-industries-heading"
          >
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <h2
                id="software-popular-industries-heading"
                className="font-display text-lg font-bold text-[#0f2744] dark:text-white md:text-xl"
              >
                Popular Industries
              </h2>
              <a
                href="#all-industries"
                className="text-sm font-semibold text-[#2563eb] hover:underline"
              >
                View All Industries
              </a>
            </div>
            <IndustryGrid industries={popularIndustries} root="software" />
          </section>
        ) : null}

        {featured.items.length > 0 ? (
          <section className="mb-8 md:mb-10" aria-labelledby="software-featured-heading">
            <h2
              id="software-featured-heading"
              className="mb-3 font-display text-lg font-bold text-[#0f2744] dark:text-white md:text-xl"
            >
              Featured Software
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.items.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}

        {businessNeedIndustries.length > 0 ? (
          <section className="mb-8 md:mb-10" aria-labelledby="software-business-need-heading">
            <h2
              id="software-business-need-heading"
              className="mb-3 font-display text-lg font-bold text-[#0f2744] dark:text-white md:text-xl"
            >
              Browse by Business Need
            </h2>
            <p className="mb-3 max-w-xl text-sm text-text-secondary">
              Cross-industry tools for HR, finance, CRM, inventory and more.
            </p>
            <IndustryGrid industries={businessNeedIndustries} root="software" />
          </section>
        ) : null}

        {industries.length > 0 ? (
          <section
            id="all-industries"
            className="mb-8 md:mb-10 scroll-mt-20"
            aria-labelledby="software-all-industries-heading"
          >
            <h2
              id="software-all-industries-heading"
              className="mb-3 font-display text-lg font-bold text-[#0f2744] dark:text-white md:text-xl"
            >
              All Industries
            </h2>
            <IndustryGrid industries={industries} root="software" />
          </section>
        ) : null}

        <div id="software-catalog">
          <h2 className="mb-3 font-display text-lg font-bold text-[#0f2744] dark:text-white md:text-xl">
            All Solutions
          </h2>
          <Suspense fallback={<CatalogFallback />}>
            <SoftwareCatalog
              initialFilters={{ q, category, group, child, more, page }}
              initialData={result}
              childOptions={childOptions}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
