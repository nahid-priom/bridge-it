import { buildPageMetadata } from '@/lib/metadata';
import { SITE_DESCRIPTION } from '@/lib/site';
import { SolutionsPageClient } from '@/components/solutions/SolutionsPageClient';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';
import { getActiveCategories } from '@/lib/services/categories.service';
import { getPublishedProducts } from '@/lib/services/products.service';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Solutions',
  description: SITE_DESCRIPTION,
  path: '/solutions',
});

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; pricing_type?: string }>;
};

export default async function SolutionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getPublishedProducts({
      q: params.q,
      category: params.category,
      sort: (params.sort as 'popular' | 'price_asc' | 'price_desc' | 'newest') ?? 'popular',
      pricing_type: params.pricing_type as 'custom_quote' | undefined,
    }),
  ]);

  return (
    <>
      <PageBreadcrumbJsonLd path="/solutions" />
      <SolutionsPageClient
        categories={categories}
        products={products}
        initialQuery={params.q ?? ''}
        initialCategory={params.category ?? ''}
      />
    </>
  );
}
