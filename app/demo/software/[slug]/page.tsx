import { notFound } from 'next/navigation';
import { getSoftwareDemoConfigBySlug } from '@/lib/services/software-demo.service';
import { SoftwareDemoShell } from '@/components/software-demo/SoftwareDemoShell';
import { SoftwareDemoApp } from '@/components/software-demo/SoftwareDemoApp';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export default async function SoftwareDemoPage({ params }: PageProps) {
  const { slug } = await params;
  const config = await getSoftwareDemoConfigBySlug(slug);
  if (!config?.product) notFound();

  const product = config.product;

  return (
    <SoftwareDemoShell
      productName={product.name ?? config.demo_title}
      productSlug={product.slug ?? slug}
      price={Number(product.starting_price ?? 0)}
      businessType={config.business_type}
    >
      <SoftwareDemoApp config={config} demoSlug={slug} />
    </SoftwareDemoShell>
  );
}
