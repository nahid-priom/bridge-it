import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { buildPageMetadata } from '@/lib/metadata';
import {
  getEcommerceProductBySlug,
  getEcommerceComparisonMatrix,
  getStageTemplateForEcommerceProduct,
} from '@/lib/services/ecommerce-showroom.service';
import { PackageComparison } from '@/components/solutions/PackageComparison';
import { EcommercePackageComparison } from '@/components/solutions/EcommercePackageComparison';
import { EcommercePreviewStrip } from '@/components/solutions/EcommercePreviewStrip';
import { EcommerceDeliveryTimeline } from '@/components/solutions/EcommerceDeliveryTimeline';
import { StickyMobileCta } from '@/components/solutions/StickyMobileCta';
import { JsonLd } from '@/components/layout/JsonLd';
import { bitpSolutionJsonLd, bitpSolutionBreadcrumbJsonLd } from '@/lib/structured-data';
import { ROUTES } from '@/lib/routes';
import { formatProductPrice } from '@/lib/format/currency';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getEcommerceProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.short_description ?? undefined,
    path: ROUTES.ecommerceSolution(slug),
    keywords: product.keywords?.length ? product.keywords : undefined,
    image: product.cover_image ?? product.thumbnail,
  });
}

export default async function EcommerceSolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, comparison, stageTemplate] = await Promise.all([
    getEcommerceProductBySlug(slug),
    getEcommerceComparisonMatrix(),
    getEcommerceProductBySlug(slug).then((p) =>
      p ? getStageTemplateForEcommerceProduct(p.id) : null
    ),
  ]);

  if (!product) notFound();

  const demoSlug = product.internal_demo_slug;
  const cover = product.cover_image ?? product.thumbnail ?? `/showroom/covers/${product.slug}.svg`;
  const pkg = product.packages[0];
  const price = formatProductPrice(Number(product.starting_price), product.pricing_type ?? 'fixed', {
    promotionalPrice: product.promotional_price,
  });
  const showAdminPreview = Boolean(product.demo_config?.feature_flags?.adminPreview);
  const stageSteps = stageTemplate?.steps ?? [];

  return (
    <div className="pb-24 md:pb-16">
      <JsonLd data={[bitpSolutionJsonLd(product), bitpSolutionBreadcrumbJsonLd(product)]} />

      {/* Hero */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-text-secondary mb-6">
          <Link href={ROUTES.home} className="hover:text-deshi-green">Home</Link>
          <span className="mx-2">/</span>
          <Link href={ROUTES.ecommerceShowroom} className="hover:text-deshi-green">E-commerce Solutions</Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <Image src={cover} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div>
            <span className="text-sm font-semibold text-deshi-green uppercase tracking-wide">E-commerce Solution</span>
            <h1 className="text-3xl md:text-4xl font-black mt-2 mb-4">{product.name}</h1>
            {product.short_description && (
              <p className="text-text-secondary text-lg mb-4">{product.short_description}</p>
            )}
            {product.target_customer && (
              <p className="text-sm mb-4"><strong>Best for:</strong> {product.target_customer}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                {price.secondary && <p className="text-xs text-text-secondary">{price.secondary}</p>}
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-deshi-green">{price.primary}</p>
                  {price.strikethrough && (
                    <p className="text-lg text-text-secondary line-through">{price.strikethrough}</p>
                  )}
                </div>
              </div>
              {product.delivery_time && (
                <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                  <Clock className="w-4 h-4" aria-hidden />
                  {product.delivery_time}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {demoSlug && (
                <Link
                  href={ROUTES.ecommerceDemo(demoSlug)}
                  className="deshi-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold"
                >
                  <Play className="w-4 h-4" aria-hidden />
                  View Live Demo
                </Link>
              )}
              <Link
                href={ROUTES.ecommerceSolutionOrder(slug)}
                className="deshi-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold"
              >
                Order This Solution
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      {product.full_description && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-black mb-4">Overview</h2>
          <p className="text-text-secondary whitespace-pre-line max-w-3xl">{product.full_description}</p>
        </section>
      )}

      {/* What's included */}
      {pkg?.features && pkg.features.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-black mb-6">What&apos;s Included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pkg.features.filter((f) => f.included).map((f) => (
              <div key={f.id} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 p-4">
                <span className="text-emerald-500">✓</span>
                <span className="text-sm font-medium">{f.feature_text}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key features from package */}
      {pkg?.features && pkg.features.filter((f) => f.included).length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-black mb-6">Key Features</h2>
          <ul className="grid sm:grid-cols-2 gap-2 max-w-3xl">
            {pkg.features.filter((f) => f.included).slice(0, 8).map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-emerald-500 mt-0.5">•</span>
                {f.feature_text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Previews */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <EcommercePreviewStrip
            title={product.name}
            cover={cover}
            demoSlug={demoSlug}
            demoUrl={product.demo_url}
            previewUrl={product.preview_url}
            variant="storefront"
          />
          {showAdminPreview && (
            <EcommercePreviewStrip
              title={product.name}
              cover={cover}
              demoSlug={demoSlug}
              variant="admin"
            />
          )}
        </div>
      </section>

      {/* How it works from stage template or fallback */}
      <section className="bg-slate-50 dark:bg-[#0a0e1a] py-12 mb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black mb-8 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {(stageSteps.length > 0
              ? stageSteps.map((s) => s.title)
              : ['Browse & Demo', 'Place Order', 'Submit Requirements', 'Track Progress']
            ).map((step, i) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center mx-auto mb-2">
                  {i + 1}
                </div>
                <p className="font-semibold text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery timeline */}
      {(stageSteps.length > 0 || product.delivery_time) && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <EcommerceDeliveryTimeline steps={stageSteps} deliveryTime={product.delivery_time} />
        </section>
      )}

      {/* Requirements summary */}
      {product.requirement_fields.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-black mb-4">What We&apos;ll Need From You</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary max-w-2xl">
            {product.requirement_fields.slice(0, 6).map((f) => (
              <li key={f.id}>{f.label}{f.required ? ' (required)' : ''}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Comparison */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-black mb-6">Compare Packages</h2>
        <EcommercePackageComparison
          products={comparison.products}
          rows={comparison.rows}
          highlightSlug={slug}
        />
      </section>

      {/* Package */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-black mb-6">Package & Pricing</h2>
        <PackageComparison product={product} orderBasePath={ROUTES.ecommerceSolution(slug)} />
      </section>

      {/* FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 max-w-2xl">
          <h2 className="text-2xl font-black mb-6">FAQ</h2>
          {product.faqs.map((faq) => (
            <details key={faq.id} className="border-b border-slate-200 dark:border-white/10 py-4">
              <summary className="font-semibold cursor-pointer">{faq.question}</summary>
              <p className="text-sm text-text-secondary mt-2">{faq.answer}</p>
            </details>
          ))}
        </section>
      )}

      {/* Final CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-8 text-center bg-gradient-to-br from-[#0f2744]/5 to-emerald-500/5">
          <h2 className="text-xl font-black mb-2">Ready to Get Started?</h2>
          <p className="text-text-secondary mb-6">Try the live demo or place your order today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {demoSlug && (
              <Link href={ROUTES.ecommerceDemo(demoSlug)} className="deshi-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 font-bold">
                <Play className="w-4 h-4" aria-hidden />
                View Live Demo
              </Link>
            )}
            <Link href={ROUTES.ecommerceSolutionOrder(slug)} className="deshi-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold">
              Order Now
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link href={`${ROUTES.consultation}?product=${slug}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-emerald-600 hover:underline">
              <MessageCircle className="w-4 h-4" aria-hidden />
              Need Something Different?
            </Link>
          </div>
        </div>
      </section>

      <StickyMobileCta slug={slug} demoSlug={demoSlug} />
    </div>
  );
}
