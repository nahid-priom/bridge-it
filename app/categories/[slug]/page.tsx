import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { CategoryDetail } from '@/components/CategoryDetail';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import { fetchCategoryBySlug, fetchCategoryServices } from '@/lib/catalog/categories';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';
import { BRANDING } from '@/lib/config/branding';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return {};
  return buildPageMetadata({
    title: `${category.name} Services`,
    description: category.description,
    path: `/categories/${slug}`,
    keywords: [category.name, category.nameBn, BRANDING.appName],
  });
}

export default async function CategoryDetailRoute({ params }: Props) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) notFound();

  const services = await fetchCategoryServices(slug);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: category.name, href: `/categories/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BreadcrumbOverrideProvider items={breadcrumbItems}>
        <CategoryDetail category={category} services={services} />
      </BreadcrumbOverrideProvider>
    </>
  );
}
