import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { buildPageMetadata } from '@/lib/metadata';
import { getProductBySlug, getRelatedProducts } from '@/lib/services/products.service';
import { PackageComparison } from '@/components/solutions/PackageComparison';
import { EcommerceDeliveryTimeline } from '@/components/solutions/EcommerceDeliveryTimeline';
import { SolutionStickyMobileCta } from '@/components/solutions/SolutionStickyMobileCta';
import { SolutionCard } from '@/components/solutions/SolutionCard';
import { SolutionCoverImage } from '@/components/solutions/SolutionCoverImage';
import { JsonLd } from '@/components/layout/JsonLd';
import { bitpSolutionBreadcrumbJsonLd, bitpSolutionJsonLd } from '@/lib/structured-data';
import { ROUTES } from '@/lib/routes';
import { formatProductPrice } from '@/lib/format/currency';
import { getProductCoverAlt, getProductCoverUrl } from '@/lib/solutions/getProductCoverUrl';
import { getSolutionOrderPath } from '@/lib/solutions/product-routes';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.short_description ?? undefined,
    path: ROUTES.solution(slug),
    keywords: product.keywords?.length ? product.keywords : undefined,
    image: product.cover_image ?? product.thumbnail,
  });
}

function categoryHeroNote(categorySlug?: string): string | null {
  if (categorySlug === 'digital-marketing') return 'Monthly service packages — ad spend billed separately unless noted.';
  if (categorySlug === 'graphics-creative') return 'Deliverables and revision rounds vary by package.';
  if (categorySlug === 'web-app-solutions') return 'Delivery timeline depends on scope and package tier.';
  return null;
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === 'ecommerce-website') {
    redirect(ROUTES.ecommerceSolution('automated-ecommerce'));
  }
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  if (product.category?.slug === 'ecommerce-solutions') {
    redirect(ROUTES.ecommerceSolution(slug));
  }
  if (product.category?.slug === 'software-solutions' && product.showroom_featured) {
    redirect(ROUTES.softwareSolution(slug));
  }

  const related = await getRelatedProducts(product, 4);
  const catSlug = product.category?.slug;
  const heroNote = categoryHeroNote(catSlug);
  const price = formatProductPrice(Number(product.starting_price), product.pricing_type ?? 'fixed', {
    promotionalPrice: product.promotional_price,
    billingType: product.packages[0]?.billing_type,
  });
  const isMarketing = catSlug === 'digital-marketing';

  return (
    <div className="pb-24 md:pb-16">
      <JsonLd data={[bitpSolutionJsonLd(product), bitpSolutionBreadcrumbJsonLd(product)]} />
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
          <SolutionCoverImage
            src={getProductCoverUrl(product) ?? product.cover_image ?? product.thumbnail}
            alt={getProductCoverAlt(product)}
            categorySlug={product.category?.slug}
            aspectClassName="aspect-video rounded-2xl"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          <div>
            <span className="text-sm font-semibold text-deshi-green uppercase tracking-wide">
              {product.category?.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary mt-2 mb-4">{product.name}</h1>
            {product.short_description && (
              <p className="text-text-secondary text-lg mb-4">{product.short_description}</p>
            )}
            {product.target_customer && (
              <p className="text-sm text-text-secondary mb-4">
                <strong className="text-text-primary">Best for:</strong> {product.target_customer}
              </p>
            )}
            {heroNote && (
              <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-2 mb-4">
                {heroNote}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                <p className="text-xs text-text-secondary">
                  {product.pricing_type === 'custom_quote' ? 'Pricing' : price.secondary ?? 'Starting from'}
                </p>
                <p className="text-2xl font-black">
                  {product.pricing_type === 'custom_quote' ? 'Custom Quote' : price.primary}
                </p>
                {price.strikethrough && (
                  <p className="text-sm text-text-secondary line-through">{price.strikethrough}</p>
                )}
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
                    : getSolutionOrderPath(product)
                }
                className="deshi-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5"
              >
                {product.pricing_type === 'custom_quote' ? 'Request Custom Quote' : 'Order Now'}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href={`${ROUTES.consultation}?product=${slug}`}
                className="deshi-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3.5"
              >
                <MessageCircle className="w-4 h-4" aria-hidden />
                Free Consultation
              </Link>
            </div>
          </div>
        </div>

        {product.full_description && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">About This Solution</h2>
            <p className="text-text-secondary whitespace-pre-line max-w-3xl">{product.full_description}</p>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-black mb-2">Packages & Pricing</h2>
          {isMarketing && (
            <p className="text-sm text-text-secondary mb-4">Ad spend for Meta/Google campaigns is not included in package price.</p>
          )}
          <PackageComparison product={product} />
        </section>

        {(product.stage_steps?.length ?? 0) > 0 && (
          <section className="mb-12">
            <EcommerceDeliveryTimeline steps={product.stage_steps!} deliveryTime={product.delivery_time} />
          </section>
        )}

        {product.requirement_fields.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black mb-4">What We Need From You</h2>
            <ul className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              {product.requirement_fields.map((f) => (
                <li key={f.id} className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm">
                  <span className="font-semibold">{f.label}</span>
                  {f.required && <span className="text-red-500 ml-1">*</span>}
                  {f.help_text && <p className="text-xs text-text-secondary mt-1">{f.help_text}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(product.faqs?.length ?? 0) > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black mb-6">FAQ</h2>
            <dl className="space-y-4 max-w-2xl">
              {product.faqs!.map((faq) => (
                <div key={faq.id} className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
                  <dt className="font-semibold">{faq.question}</dt>
                  <dd className="text-sm text-text-secondary mt-2">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

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

      <SolutionStickyMobileCta slug={slug} variant="generic" orderPath={getSolutionOrderPath(product)} />
    </div>
  );
}
