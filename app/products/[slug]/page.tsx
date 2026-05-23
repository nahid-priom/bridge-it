import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import { getReviewsByProductSlug } from '@/data/reviews';
import { getProductBySlug, getSimilarProducts } from '@/lib/products/detail';
import { buildProductDetailMetadata } from '@/lib/products/page-meta';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return buildProductDetailMetadata(slug);
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const reviews = getReviewsByProductSlug(slug);
  const similarProducts = getSimilarProducts(product, 8);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    {
      label: product.categoryLabel,
      href: `/products?category=${product.categoryKey}`,
    },
    { label: product.title, href: `/products/${product.slug}` },
  ];

  return (
    <>
      <ProductJsonLd product={product} reviews={reviews} breadcrumbItems={breadcrumbItems} />
      <BreadcrumbOverrideProvider items={breadcrumbItems}>
        <ProductDetailView
          product={product}
          reviews={reviews}
          similarProducts={similarProducts}
        />
      </BreadcrumbOverrideProvider>
    </>
  );
}
