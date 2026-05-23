import { buildPageMetadata } from '@/lib/metadata';
import { CategoriesPage } from '@/components/CategoriesPage';
import { getProductCategoriesForCategoriesPage } from '@/lib/catalog/productCategoriesUi';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Service Categories',
  description: 'Browse all Deshi Fiverr service categories.',
  path: '/categories',
});

export default async function CategoriesRoute() {
  const categories = getProductCategoriesForCategoriesPage();
  return (
    <>
      <PageBreadcrumbJsonLd path="/categories" />
      <CategoriesPage categories={categories} />
    </>
  );
}
