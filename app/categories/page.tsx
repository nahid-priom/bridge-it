import { buildPageMetadata } from '@/lib/metadata';
import { CategoriesPage } from '@/components/CategoriesPage';
import { PageBreadcrumbJsonLd } from '@/components/seo/PageBreadcrumbJsonLd';

export const metadata = buildPageMetadata({
  title: 'Service Categories',
  description:
    'Browse all digital service categories on Bridge — animation, software, video ads, courses, web development, and more.',
  path: '/categories',
  keywords: ['categories', 'digital services', 'IT marketplace Bangladesh'],
});

export default function CategoriesRoute() {
  return (
    <>
      <PageBreadcrumbJsonLd path="/categories" />
      <CategoriesPage />
    </>
  );
}
