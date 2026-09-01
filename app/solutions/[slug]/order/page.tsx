import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/services/products.service';
import { OrderPageClient } from '@/components/order/OrderPageClient';
import { buildPageMetadata } from '@/lib/metadata';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ package?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: `Order ${product.name}`,
    path: `/solutions/${slug}/order`,
    noIndex: true,
  });
}

export default async function SolutionOrderPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { package: packageId } = await searchParams;
  const product = await getProductBySlug(slug);

  if (!product || product.pricing_type === 'custom_quote') notFound();

  return (
    <OrderPageClient
      product={product}
      selectedPackageId={packageId}
      solutionBasePath={`/solutions/${slug}`}
      returnPath={`/solutions/${slug}/order${packageId ? `?package=${packageId}` : ''}`}
    />
  );
}
