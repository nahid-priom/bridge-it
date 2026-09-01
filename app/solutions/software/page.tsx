import { buildPageMetadata } from '@/lib/metadata';
import { PageHero } from '@/components/ui/PageHero';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { SoftwareShowroomGrid } from '@/components/solutions/SoftwareShowroomGrid';
import { SoftwarePackageComparison } from '@/components/solutions/SoftwarePackageComparison';
import { getSoftwareFlagshipsWithFeatures, getSoftwareComparisonMatrix } from '@/lib/services/software-showroom.service';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Custom Business Software',
  description: 'আপনার ব্যবসার কাজ অনুযায়ী Software দেখুন, Live Demo ব্যবহার করুন, তারপর Order করুন। Stock থেকে Production, Accounts থেকে Complete Business Automation.',
  path: '/solutions/software',
});

export default async function SoftwareShowroomPage() {
  const [flagships, comparison] = await Promise.all([
    getSoftwareFlagshipsWithFeatures(),
    getSoftwareComparisonMatrix(),
  ]);

  return (
    <div className="pb-16">
      <PageBreadcrumbJsonLd path="/solutions/software" />
      <PageHero
        variant="marketing"
        title="Custom Business Software"
        highlightedText=""
        subtitle="আপনার ব্যবসার কাজ অনুযায়ী Software দেখুন, Live Demo ব্যবহার করুন, তারপর Order করুন।"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
        <p className="text-center text-text-secondary max-w-3xl mx-auto">
          Stock থেকে Production, Accounts থেকে Complete Business Automation — আপনার প্রয়োজন অনুযায়ী Custom Solution.
        </p>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {flagships.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
            <p className="text-lg font-semibold mb-2">No software solutions available</p>
          </div>
        ) : (
          <SoftwareShowroomGrid flagships={flagships} />
        )}
        {comparison.products.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-black mb-6 text-center">Compare Software Packages</h2>
            <SoftwarePackageComparison products={comparison.products} rows={comparison.rows} />
          </section>
        )}
      </div>
    </div>
  );
}
