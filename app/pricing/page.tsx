import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/site';
import { PageHero } from '@/components/ui/PageHero';
import { PAGE_HEROES } from '@/lib/config/page-heroes';
import { getActiveCategories } from '@/lib/services/categories.service';
import { getPublishedProducts } from '@/lib/services/products.service';
import { ROUTES } from '@/lib/routes';
import { formatBdt } from '@/lib/services/client';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: `Pricing | ${SITE_NAME}`,
  path: '/pricing',
});

export default async function PricingPage() {
  const categories = await getActiveCategories();
  const productsByCategory = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      products: await getPublishedProducts({ category: cat.slug, limit: 6 }),
    }))
  );

  return (
    <div className="pb-16">
      <PageHero
        variant="marketing"
        title={PAGE_HEROES.pricing.title}
        highlightedText={PAGE_HEROES.pricing.highlightedText}
        subtitle={PAGE_HEROES.pricing.subtitle}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {productsByCategory.map(({ category, products }) =>
          products.length > 0 ? (
            <section key={category.id}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black">
                  {category.icon} {category.name}
                </h2>
                <Link href={`${ROUTES.solutions}?category=${category.slug}`} className="text-sm font-semibold text-deshi-green hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={ROUTES.solution(p.slug)}
                    className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 hover:border-deshi-green/40 transition-colors"
                  >
                    <h3 className="font-bold text-text-primary">{p.name}</h3>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{p.short_description}</p>
                    <p className="text-lg font-black text-deshi-green mt-3">
                      {p.pricing_type === 'custom_quote' ? 'Custom Quote' : `From ${formatBdt(Number(p.starting_price))}`}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null
        )}

        {productsByCategory.every((c) => c.products.length === 0) && (
          <p className="text-center text-text-secondary py-16">Pricing information will appear here once solutions are published.</p>
        )}
      </div>
    </div>
  );
}
