import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { SITE_URL } from '@/lib/site';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { getCreativeMarketingBySlug } from '@/src/features/creative-marketing-showcase/api/projects';
import { CreativeMarketingPreview } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingPreview';
import {
  CatalogAnalytics,
  RelatedProducts,
  buildProductBreadcrumbs,
  buildProductMetadata,
  categoryPath,
  getProductByPath,
  listProducts,
  listRelatedProducts,
  productPath,
} from '@/src/features/catalog';

export const revalidate = 60;

type Props = {
  params: Promise<{ industry: string; product: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { industry, product: productSlug } = await params;
  const { preview } = await searchParams;
  const includeDrafts =
    preview === '1' ? isShowcaseViewerRole((await getCurrentProfile())?.role) : false;

  const catalogProduct = await getProductByPath('marketing', industry, productSlug, {
    includeDrafts,
  });
  if (!catalogProduct) {
    return buildPageMetadata({
      title: 'Creative & Marketing',
      path: productPath('marketing', industry, productSlug),
    });
  }

  const meta = buildProductMetadata('marketing', catalogProduct, {
    name: catalogProduct.industry_name || industry,
    slug: catalogProduct.industry_slug || industry,
  });
  const project = await getCreativeMarketingBySlug(productSlug, { includeDrafts });
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: meta.canonicalPath,
    keywords: project?.seo_keywords,
    image: project?.og_image_url || project?.cover_detail_url || project?.cover_card_url,
    noIndex: catalogProduct.published === false,
  });
}

export default async function MarketingProductPage({ params, searchParams }: Props) {
  const { industry, product: productSlug } = await params;
  const { preview } = await searchParams;
  const includeDrafts =
    preview === '1' ? isShowcaseViewerRole((await getCurrentProfile())?.role) : false;

  const catalogProduct = await getProductByPath('marketing', industry, productSlug, {
    includeDrafts,
  });
  if (!catalogProduct) notFound();

  const project = await getCreativeMarketingBySlug(productSlug, { includeDrafts });
  if (!project) notFound();

  const relatedFromCatalog = await listRelatedProducts('marketing', project.id, { limit: 8 });
  let relatedItems = relatedFromCatalog.filter((r) => r.product && r.product.id !== project.id);

  if (relatedItems.length === 0 && catalogProduct.industry_id) {
    const sameIndustry = await listProducts({
      root: 'marketing',
      industryId: catalogProduct.industry_id,
      pageSize: 8,
    });
    relatedItems = sameIndustry.items
      .filter((p) => p.id !== project.id)
      .slice(0, 4)
      .map((product, index) => ({
        id: `same-${product.id}`,
        source_kind: 'marketing' as const,
        source_id: project.id,
        related_kind: 'marketing' as const,
        related_id: product.id,
        sort_order: index,
        product,
      }));
  }

  const industryMeta = {
    name: catalogProduct.industry_name || industry,
    slug: catalogProduct.industry_slug || industry,
  };
  const canonical =
    catalogProduct.canonical_path ||
    productPath('marketing', industryMeta.slug, project.slug);
  const crumbs = buildProductBreadcrumbs('marketing', industryMeta, catalogProduct);

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: project.title,
            description: project.short_description,
            url: `${SITE_URL}${canonical}`,
            provider: { '@type': 'Organization', name: 'Bridge IT Park', url: SITE_URL },
            areaServed: { '@type': 'Country', name: 'Bangladesh' },
            offers: {
              '@type': 'Offer',
              priceCurrency: project.currency,
              price: project.starting_price,
            },
          },
          breadcrumbJsonLd(
            crumbs.map((c) => ({
              name: c.name,
              url: c.path.startsWith('http') ? c.path : `${SITE_URL}${c.path}`,
            }))
          ),
        ]}
      />
      <CatalogAnalytics
        payload={{
          event: 'catalog_product_view',
          category_root: 'marketing',
          industry: industryMeta.slug,
          product: project.slug,
        }}
      />
      {!project.published ? (
        <p className="bg-amber-100 py-2 text-center text-sm text-amber-900">Draft preview — not public</p>
      ) : null}
      <CreativeMarketingPreview project={project} />
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-12 sm:px-6 lg:px-8 xl:px-10">
        <RelatedProducts items={relatedItems} />
        <p className="mt-6 text-sm">
          <a href={categoryPath('marketing')} className="font-semibold text-[#2563eb] hover:underline">
            ← All marketing services
          </a>
        </p>
      </div>
    </>
  );
}
