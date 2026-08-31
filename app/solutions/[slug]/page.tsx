import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { buildPageMetadata } from '@/lib/metadata';
import { getProductBySlug, getRelatedProducts } from '@/lib/services/products.service';
import { PackageComparison } from '@/components/solutions/PackageComparison';
import { SolutionCard } from '@/components/solutions/SolutionCard';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/services/client';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: product.seo_title ?? `${product.name} | Bridge IT Park`,
    description: product.seo_description ?? product.short_description ?? undefined,
    path: ROUTES.solution(slug),
  });
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-text-secondary mb-6">
          <Link href={ROUTES.solutions} className="hover:text-deshi-green">Solutions</Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`${ROUTES.solutions}?category=${product.category.slug}`} className="hover:text-deshi-green">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600/20 to-teal-700/20">
            {product.cover_image || product.thumbnail ? (
              <Image
                src={product.cover_image ?? product.thumbnail!}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl">{product.category?.icon ?? '💼'}</div>
            )}
          </div>

          <div>
            <span className="text-sm font-semibold text-deshi-green uppercase tracking-wide">
              {product.category?.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary mt-2 mb-4">{product.name}</h1>
            {product.short_description && (
              <p className="text-text-secondary text-lg mb-6">{product.short_description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                <p className="text-xs text-text-secondary">
                  {product.pricing_type === 'custom_quote' ? 'Pricing' : 'Starting from'}
                </p>
                <p className="text-2xl font-black">
                  {product.pricing_type === 'custom_quote'
                    ? 'Custom Quote'
                    : formatBdt(Number(product.starting_price))}
                </p>
              </div>
              {product.delivery_time && (
                <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                  <Clock className="w-4 h-4" aria-hidden />
                  {product.delivery_time}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={
                  product.pricing_type === 'custom_quote'
                    ? ROUTES.solutionQuote(slug)
                    : ROUTES.solutionOrder(slug)
                }
                className="deshi-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5"
              >
                {product.pricing_type === 'custom_quote' ? 'Request Custom Quote' : 'Order Now'}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              {product.demo_url && (
                <a
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deshi-btn-outline inline-flex items-center justify-center px-6 py-3.5"
                >
                  View Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {product.full_description && (
          <section className="mb-12 prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold mb-4">About This Solution</h2>
            <p className="text-text-secondary whitespace-pre-line">{product.full_description}</p>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-black mb-6">Packages & Pricing</h2>
          <PackageComparison product={product} />
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-black mb-6">Related Solutions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <SolutionCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
