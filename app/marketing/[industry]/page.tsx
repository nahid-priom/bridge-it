import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { SITE_URL } from '@/lib/site';
import {
  CatalogAnalytics,
  CatalogBreadcrumb,
  CatalogCTA,
  CatalogEmptyState,
  CatalogFaqList,
  CatalogProductCard,
  buildIndustryBreadcrumbs,
  buildIndustryMetadata,
  categoryPath,
  getIndustryByPath,
  industryPath,
  listFaqs,
  listProducts,
  lookupRedirect,
  productPath,
} from '@/src/features/catalog';

export const revalidate = 60;

type Props = {
  params: Promise<{ industry: string }>;
};

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

export default async function MarketingIndustryPage({ params }: Props) {
  const { industry: industrySlug } = await params;
  const industry = await getIndustryByPath('marketing', industrySlug);

  if (!industry) {
    const redir = await lookupRedirect(`/marketing/${industrySlug}`);
    if (redir?.to_path) redirect(redir.to_path);
    const legacy = await lookupRedirect(`/creative-marketing/${industrySlug}`);
    if (legacy?.to_path) redirect(legacy.to_path);
    notFound();
  }

  const [products, faqs] = await Promise.all([
    listProducts({ root: 'marketing', industryId: industry.id, pageSize: 48 }),
    listFaqs({ industryId: industry.id }),
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
      numberOfItems: products.total,
      itemListElement: products.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${item.canonical_path || productPath('marketing', industry.slug, item.slug)}`,
        name: item.title,
      })),
    },
  };

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
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-3 sm:px-6 sm:pt-4 lg:px-8 xl:px-10">
        <CatalogBreadcrumb items={crumbs} className="mb-4" />
        <header className="mb-6 md:mb-8">
          <h1 className="font-display text-2xl font-black tracking-tight text-[#0f2744] dark:text-white sm:text-3xl md:text-4xl">
            {h1}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary md:text-base">{intro}</p>
          <CatalogCTA
            className="mt-5"
            productSlug={industry.slug}
            industrySlug={industry.slug}
            kind="marketing"
            demoLabel="Free Demo"
            orderLabel="Order Now"
          />
        </header>

        {products.items.length === 0 ? (
          <CatalogEmptyState
            title="No services in this industry yet"
            description="Browse other marketing industries or request a custom package."
            actionHref={categoryPath('marketing')}
            actionLabel="Browse marketing"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {products.items.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <CatalogFaqList faqs={faqs} />

        <p className="mt-10 text-sm">
          <Link href={categoryPath('marketing')} className="font-semibold text-[#2563eb] hover:underline">
            ← All marketing services
          </Link>
        </p>
      </div>
    </>
  );
}
