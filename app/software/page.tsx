import { Suspense } from 'react';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/routes';
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

const PAGE_TITLE = 'Software Solutions';
const PAGE_DESCRIPTION =
  'ERP, POS, CRM, HRM & custom business software built around real operations.';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export const metadata = buildPageMetadata({
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
});

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

  const [result, taxonomy] = await Promise.all([
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
  ]);

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
        url: `${SITE_URL}${ROUTES.softwareSolution(item.slug)}`,
        name: item.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageBreadcrumbJsonLd path={ROUTES.softwareShowroom} />
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-0 sm:px-6 lg:px-8 xl:px-10">
        <header className="mb-4 md:mb-6">
          <h1 className="font-display text-2xl font-black tracking-tight text-[#0f2744] dark:text-white sm:text-3xl md:text-4xl">
            Software Solutions
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-text-secondary md:text-base">
            ERP, POS, CRM, HRM & custom business software built around real operations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="#software-catalog"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0f2744] px-4 text-sm font-semibold text-white hover:bg-[#16375f]"
            >
              Explore Software
            </a>
            <Link
              href={ROUTES.consultation}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border-subtle px-4 text-sm font-semibold text-text-primary hover:border-[#2563eb]/40"
            >
              Free Demo
            </Link>
          </div>
        </header>
        <div id="software-catalog">
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
