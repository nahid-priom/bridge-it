import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { buildPageMetadata } from '@/lib/metadata';
import {
  getSoftwareProductBySlug,
  getSoftwareComparisonMatrix,
  getStageTemplateForSoftwareProduct,
} from '@/lib/services/software-showroom.service';
import { PackageComparison } from '@/components/solutions/PackageComparison';
import { SoftwarePackageComparison } from '@/components/solutions/SoftwarePackageComparison';
import { SoftwarePreviewStrip } from '@/components/solutions/SoftwarePreviewStrip';
import { EcommerceDeliveryTimeline } from '@/components/solutions/EcommerceDeliveryTimeline';
import { SolutionStickyMobileCta } from '@/components/solutions/SolutionStickyMobileCta';
import { JsonLd } from '@/components/layout/JsonLd';
import { bitpSolutionJsonLd, bitpSolutionBreadcrumbJsonLd } from '@/lib/structured-data';
import { ROUTES } from '@/lib/routes';
import { formatProductPrice } from '@/lib/format/currency';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getSoftwareProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.short_description ?? undefined,
    path: ROUTES.softwareSolution(slug),
    keywords: product.keywords?.length ? product.keywords : undefined,
    image: product.cover_image ?? product.thumbnail,
  });
}

export default async function SoftwareSolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, comparison, stageTemplate] = await Promise.all([
    getSoftwareProductBySlug(slug),
    getSoftwareComparisonMatrix(),
    getSoftwareProductBySlug(slug).then((p) => (p ? getStageTemplateForSoftwareProduct(p.id) : null)),
  ]);

  if (!product) notFound();

  const demoSlug = product.internal_demo_slug;
  const cover = product.cover_image ?? product.thumbnail ?? `/showroom/covers/software-${product.slug}.svg`;
  const pkg = product.packages[0];
  const price = formatProductPrice(Number(product.starting_price), product.pricing_type ?? 'starting_from', {
    promotionalPrice: product.promotional_price,
  });
  const stageSteps = stageTemplate?.steps ?? [];
  const workflow = product.software_demo_config?.workflow_config ?? [];

  return (
    <div className="pb-24 md:pb-16">
      <JsonLd data={[bitpSolutionJsonLd(product), bitpSolutionBreadcrumbJsonLd(product)]} />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-text-secondary mb-6">
          <Link href={ROUTES.home} className="hover:text-deshi-green">Home</Link>
          <span className="mx-2">/</span>
          <Link href={ROUTES.softwareShowroom} className="hover:text-deshi-green">Software Solutions</Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <Image src={cover} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div>
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Business Software</span>
            <h1 className="text-3xl md:text-4xl font-black mt-2 mb-4">{product.name}</h1>
            {product.short_description && <p className="text-text-secondary text-lg mb-4">{product.short_description}</p>}
            {product.target_customer && (
              <p className="text-sm mb-4"><strong>Best for:</strong> {product.target_customer}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                {price.secondary && <p className="text-xs text-text-secondary">{price.secondary}</p>}
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-emerald-600">{price.primary}</p>
                  {price.strikethrough && <p className="text-lg text-text-secondary line-through">{price.strikethrough}</p>}
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
                <Link href={ROUTES.softwareDemo(demoSlug)} className="deshi-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold">
                  <Play className="w-4 h-4" aria-hidden />
                  View Live Demo
                </Link>
              )}
              <Link href={ROUTES.softwareSolutionOrder(slug)} className="deshi-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold">
                Order This Solution
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {product.full_description && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-black mb-4">Overview</h2>
          <p className="text-text-secondary whitespace-pre-line max-w-3xl">{product.full_description}</p>
        </section>
      )}

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

      {workflow.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-black mb-6">Demo Workflow</h2>
          <ol className="flex flex-wrap gap-2">
            {workflow.map((step, i) => (
              <li key={step} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SoftwarePreviewStrip title={product.name} cover={cover} demoSlug={demoSlug} demoUrl={product.demo_url} />
      </section>

      <section className="bg-slate-50 dark:bg-[#0a0e1a] py-12 mb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black mb-8 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {(stageSteps.length > 0 ? stageSteps.map((s) => s.title) : ['Try Live Demo', 'Place Order', 'Submit Requirements', 'Track Delivery']).map((step, i) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center mx-auto mb-2">{i + 1}</div>
                <p className="font-semibold text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(stageSteps.length > 0 || product.delivery_time) && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <EcommerceDeliveryTimeline steps={stageSteps} deliveryTime={product.delivery_time} />
        </section>
      )}

      {product.requirement_fields.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-black mb-4">What We&apos;ll Need From You</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary max-w-2xl">
            {product.requirement_fields.slice(0, 8).map((f) => (
              <li key={f.id}>{f.label}{f.required ? ' (required)' : ''}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-black mb-6">Compare Packages</h2>
        <SoftwarePackageComparison products={comparison.products} rows={comparison.rows} highlightSlug={slug} />
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-black mb-6">Package & Pricing</h2>
        <PackageComparison product={product} orderBasePath={ROUTES.softwareSolution(slug)} />
      </section>

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

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-8 text-center bg-gradient-to-br from-[#0f2744]/5 to-emerald-500/5">
          <h2 className="text-xl font-black mb-2">Ready to Get Started?</h2>
          <p className="text-text-secondary mb-6">Try the live demo or place your order today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {demoSlug && (
              <Link href={ROUTES.softwareDemo(demoSlug)} className="deshi-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 font-bold">
                <Play className="w-4 h-4" aria-hidden />
                View Live Demo
              </Link>
            )}
            <Link href={ROUTES.softwareSolutionOrder(slug)} className="deshi-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold">
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

      <SolutionStickyMobileCta slug={slug} demoSlug={demoSlug} variant="software" />
    </div>
  );
}
