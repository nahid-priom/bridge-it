import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/services/products.service';
import { QuotePageClient } from '@/components/order/QuotePageClient';
import { buildPageMetadata } from '@/lib/metadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: `Quote Request — ${product.name}`,
    path: `/solutions/${slug}/quote`,
    noIndex: true,
  });
}

export default async function SolutionQuotePage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <QuotePageClient product={product} />;
}
