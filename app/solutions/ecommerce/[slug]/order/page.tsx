import { notFound } from 'next/navigation';
import { getEcommerceProductBySlug } from '@/lib/services/ecommerce-showroom.service';
import { OrderPageClient } from '@/components/order/OrderPageClient';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ package?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getEcommerceProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: `Order ${product.name}`,
    path: `${ROUTES.ecommerceSolution(slug)}/order`,
    noIndex: true,
  });
}

export default async function EcommerceOrderPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { package: packageId } = await searchParams;
  const product = await getEcommerceProductBySlug(slug);
  if (!product) notFound();

  const orderPath = `${ROUTES.ecommerceSolution(slug)}/order${packageId ? `?package=${packageId}` : ''}`;

  return (
    <OrderPageClient
      product={product}
      selectedPackageId={packageId}
      solutionBasePath={ROUTES.ecommerceSolution(slug)}
      returnPath={orderPath}
    />
  );
}
