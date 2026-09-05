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
  RelatedProducts,
  buildIndustryBreadcrumbs,
  buildIndustryMetadata,
  categoryPath,
  getIndustryByPath,
  industryPath,
  listFaqs,
  listProducts,
  listRelatedProducts,
  lookupRedirect,
  productPath,
} from '@/src/features/catalog';
import { getIndustryFlagship } from '@/src/features/software-showcase/api/projects';
import { SoftwareIndustryPackages } from '@/src/features/software-showcase/public/SoftwareIndustryPackages';

export const revalidate = 60;

type Props = {
  params: Promise<{ industry: string }>;
};

const BENEFITS = [
  'One Time Payment',
  'Customizable',
  'Free Demo',
  'Support Included',
] as const;

export async function generateMetadata({ params }: Props) {
  const { industry: industrySlug } = await params;
  const industry = await getIndustryByPath('software', industrySlug);
  if (!industry) {
    return buildPageMetadata({
      title: 'Software industry',
      path: industryPath('software', industrySlug),
    });
  }
  const meta = buildIndustryMetadata('software', industry);
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: meta.canonicalPath,
  });
}

export default async function SoftwareIndustryPage({ params }: Props) {
  const { industry: industrySlug } = await params;
  const industry = await getIndustryByPath('software', industrySlug);

  if (!industry) {
    const redir = await lookupRedirect(`/software/${industrySlug}`);
    if (redir?.to_path) {
      redirect(redir.to_path);
    }
    notFound();
  }

  const [products, faqs, flagship] = await Promise.all([
    listProducts({ root: 'software', industryId: industry.id, pageSize: 48 }),
    listFaqs({ industryId: industry.id }),
    getIndustryFlagship(industry.slug),
  ]);

  const related =
    flagship != null
      ? await listRelatedProducts('software', flagship.id, { limit: 6 })
      : [];

  const crumbs = buildIndustryBreadcrumbs('software', industry);
  const h1 = industry.seo_h1?.trim() || industry.name;
  const intro =
    industry.seo_intro?.trim() ||
    industry.description?.trim() ||
    industry.short_description?.trim() ||
    `${industry.name} business software from Bridge IT Park.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h1,
    description: intro,
    url: `${SITE_URL}${industryPath('software', industry.slug)}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.total,
      itemListElement: products.items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${item.canonical_path || productPath('software', industry.slug, item.slug)}`,
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
          category_root: 'software',
          industry: industry.slug,
          industry_view: true,
        }}
      />
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-3 sm:px-6 sm:pt-4 lg:px-8 xl:px-10">
        <CatalogBreadcrumb items={crumbs} className="mb-4" />
        <header className="mb-6 md:mb-8">
          <h1 className="font-display text-2xl font-black tracking-tight text-[#0f2744] dark:text-white sm:text-3xl md:text-4xl">
            {h1}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary md:text-base">{intro}</p>

          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
            {BENEFITS.map((label) => (
              <li key={label} className="font-medium before:mr-1.5 before:text-[#2563eb] before:content-['·'] first:before:content-none">
                {label}
              </li>
            ))}
          </ul>

          <CatalogCTA
            className="mt-5"
            productSlug={flagship?.slug || industry.slug}
            industrySlug={industry.slug}
            kind="software"
            demoLabel="Free Demo"
            orderLabel="Order Now"
          />
        </header>

        {flagship && flagship.packages.length > 0 ? (
          <SoftwareIndustryPackages
            className="mb-10 md:mb-12"
            packages={flagship.packages}
            productSlug={flagship.slug}
            industrySlug={industry.slug}
          />
        ) : null}

        {products.items.length === 0 ? (
          <CatalogEmptyState
            title="No products in this industry yet"
            description="Browse other software industries or talk to us about a custom build."
            actionHref={categoryPath('software')}
            actionLabel="Browse software"
          />
        ) : (
          <section aria-labelledby="software-industry-products-heading">
            <h2
              id="software-industry-products-heading"
              className="mb-4 font-display text-xl font-black text-[#0f2744] dark:text-white md:text-2xl"
            >
              All {industry.name} Solutions
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {products.items.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <CatalogFaqList faqs={faqs} />

        {related.length > 0 ? <RelatedProducts items={related} /> : null}

        <p className="mt-10 text-sm">
          <Link href={categoryPath('software')} className="font-semibold text-[#2563eb] hover:underline">
            ← All software solutions
          </Link>
        </p>
      </div>
    </>
  );
}
