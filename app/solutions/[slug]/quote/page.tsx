import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/services/products.service';
import { QuotePageClient } from '@/components/order/QuotePageClient';

type PageProps = { params: Promise<{ slug: string }> };

export default async function SolutionQuotePage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <QuotePageClient product={product} />;
}
