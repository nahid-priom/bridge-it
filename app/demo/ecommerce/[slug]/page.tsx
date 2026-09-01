import { notFound } from 'next/navigation';
import { getDemoConfigBySlug } from '@/lib/services/ecommerce-demo.service';
import { DemoShell } from '@/components/ecommerce-demo/DemoShell';
import { LandingDemo } from '@/components/ecommerce-demo/landing/LandingDemo';
import { StorefrontDemo } from '@/components/ecommerce-demo/storefront/StorefrontDemo';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export default async function DemoEcommercePage({ params }: PageProps) {
  const { slug } = await params;
  const config = await getDemoConfigBySlug(slug);
  if (!config?.product) notFound();

  const product = config.product;
  const isLanding = config.feature_flags.landingOnly;

  return (
    <DemoShell
      productName={product.name ?? 'Demo'}
      productSlug={product.slug ?? slug}
      price={Number(product.starting_price ?? 0)}
      demoSlug={slug}
    >
      {isLanding ? (
        <LandingDemo config={config} productSlug={product.slug ?? slug} />
      ) : (
        <StorefrontDemo config={config} demoSlug={slug} />
      )}
    </DemoShell>
  );
}
