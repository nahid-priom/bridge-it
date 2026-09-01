import { notFound } from 'next/navigation';
import { getSoftwareProductBySlug } from '@/lib/services/software-showroom.service';
import { OrderPageClient } from '@/components/order/OrderPageClient';
import { buildPageMetadata } from '@/lib/metadata';
import { ROUTES } from '@/lib/routes';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ package?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getSoftwareProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: `Order ${product.name}`,
    path: `${ROUTES.softwareSolution(slug)}/order`,
    noIndex: true,
  });
}

export default async function SoftwareOrderPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { package: packageId } = await searchParams;
  const product = await getSoftwareProductBySlug(slug);
  if (!product) notFound();

  const orderPath = `${ROUTES.softwareSolution(slug)}/order${packageId ? `?package=${packageId}` : ''}`;

  return (
    <OrderPageClient
      product={product}
      selectedPackageId={packageId}
      solutionBasePath={ROUTES.softwareSolution(slug)}
      returnPath={orderPath}
    />
  );
}
