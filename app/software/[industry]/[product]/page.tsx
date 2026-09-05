import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { isShowcaseViewerRole } from '@/src/features/ecommerce-showcase/config/roles';
import { getSoftwareProjectBySlug } from '@/src/features/software-showcase/api/projects';
import {
  SoftwarePreview,
  SoftwarePreviewSkeleton,
} from '@/src/features/software-showcase/public/SoftwarePreview';
import {
  softwareShowcaseBreadcrumbJsonLd,
  softwareShowcaseServiceJsonLd,
} from '@/lib/structured-data';
import {
  CatalogAnalytics,
  RelatedProducts,
  buildProductMetadata,
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

  const catalogProduct = await getProductByPath('software', industry, productSlug, {
    includeDrafts,
  });
  if (!catalogProduct) {
    return buildPageMetadata({
      title: 'Software',
      path: productPath('software', industry, productSlug),
    });
  }

  const meta = buildProductMetadata('software', catalogProduct, {
    name: catalogProduct.industry_name || industry,
    slug: catalogProduct.industry_slug || industry,
  });

  const project = await getSoftwareProjectBySlug(productSlug, { includeDrafts });
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: meta.canonicalPath,
    keywords: project?.seo_keywords,
    image: project?.og_image_url || project?.cover_detail_url || project?.cover_card_url,
    noIndex: catalogProduct.published === false,
  });
}

export default async function SoftwareProductPage({ params, searchParams }: Props) {
  const { industry, product: productSlug } = await params;
  const { preview } = await searchParams;
  const includeDrafts =
    preview === '1' ? isShowcaseViewerRole((await getCurrentProfile())?.role) : false;

  const catalogProduct = await getProductByPath('software', industry, productSlug, {
    includeDrafts,
  });
  if (!catalogProduct) notFound();

  const project = await getSoftwareProjectBySlug(productSlug, { includeDrafts });
  if (!project) notFound();

  const relatedFromCatalog = await listRelatedProducts('software', project.id, { limit: 8 });
  let relatedItems = relatedFromCatalog.filter((r) => r.product && r.product.id !== project.id);

  if (relatedItems.length === 0 && catalogProduct.industry_id) {
    const sameIndustry = await listProducts({
      root: 'software',
      industryId: catalogProduct.industry_id,
      pageSize: 8,
    });
    relatedItems = sameIndustry.items
      .filter((p) => p.id !== project.id)
      .slice(0, 4)
      .map((product, index) => ({
        id: `same-${product.id}`,
        source_kind: 'software' as const,
        source_id: project.id,
        related_kind: 'software' as const,
        related_id: product.id,
        sort_order: index,
        product,
      }));
  }

  const industryMeta = {
    name: catalogProduct.industry_name || industry,
    slug: catalogProduct.industry_slug || industry,
  };

  return (
    <>
      <JsonLd
        data={[
          softwareShowcaseServiceJsonLd({
            ...project,
            industry_slug: industryMeta.slug,
            canonical_path: catalogProduct.canonical_path,
          }),
          softwareShowcaseBreadcrumbJsonLd(project.title, project.slug, {
            industryName: industryMeta.name,
            industrySlug: industryMeta.slug,
          }),
        ]}
      />
      <CatalogAnalytics
        payload={{
          event: 'catalog_product_view',
          category_root: 'software',
          industry: industryMeta.slug,
          product: project.slug,
        }}
      />
      {!project.published ? (
        <p className="bg-amber-100 py-2 text-center text-sm text-amber-900">
          Draft preview — not public
        </p>
      ) : null}
      <Suspense fallback={<SoftwarePreviewSkeleton />}>
        <SoftwarePreview project={project} />
      </Suspense>
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-12 sm:px-6 lg:px-8 xl:px-10">
        <RelatedProducts items={relatedItems} />
      </div>
    </>
  );
}
