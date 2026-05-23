import { buildPageMetadata } from '@/lib/metadata';
import { CategoriesPage } from '@/components/CategoriesPage';
import { fetchAllCategories } from '@/lib/catalog/categories';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Service Categories',
  description: 'Browse all Bridge Smart IT Park service categories.',
  path: '/categories',
});

export default async function CategoriesRoute() {
  const categories = await fetchAllCategories();
  return (
    <>
      <PageBreadcrumbJsonLd path="/categories" />
      <CategoriesPage categories={categories} />
    </>
  );
}
