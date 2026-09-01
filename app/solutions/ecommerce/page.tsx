import { buildPageMetadata } from '@/lib/metadata';
import { PageHero } from '@/components/ui/PageHero';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { EcommerceShowroomGrid } from '@/components/solutions/EcommerceShowroomGrid';
import { EcommercePackageComparison } from '@/components/solutions/EcommercePackageComparison';
import {
  getEcommerceFlagshipsWithFeatures,
  getEcommerceComparisonMatrix,
} from '@/lib/services/ecommerce-showroom.service';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'E-commerce Solutions',
  description:
    'Live Demo দেখে আপনার বাজেট অনুযায়ী E-commerce Solution বেছে নিন — from landing pages to full business suites.',
  path: '/solutions/ecommerce',
});

export default async function EcommerceShowroomPage() {
  const [flagships, comparison] = await Promise.all([
    getEcommerceFlagshipsWithFeatures(),
    getEcommerceComparisonMatrix(),
  ]);

  return (
    <div className="pb-16">
      <PageBreadcrumbJsonLd path="/solutions/ecommerce" />
      <PageHero
        variant="marketing"
        title="E-commerce Solutions"
        highlightedText=""
        subtitle="Live Demo দেখে আপনার বাজেট অনুযায়ী E-commerce Solution বেছে নিন।"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {flagships.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
            <p className="text-lg font-semibold text-text-primary mb-2">No E-commerce solutions available</p>
            <p className="text-sm text-text-secondary">Please check back soon.</p>
          </div>
        ) : (
          <EcommerceShowroomGrid flagships={flagships} />
        )}

        {comparison.products.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black mb-6 text-center">Compare All Packages</h2>
            <EcommercePackageComparison
              products={comparison.products}
              rows={comparison.rows}
            />
          </section>
        )}
      </div>
    </div>
  );
}
