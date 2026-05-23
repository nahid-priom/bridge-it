import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { ServiceDetail } from '@/components/ServiceDetail';
import { JsonLd } from '@/components/layout/JsonLd';
import { serviceJsonLd } from '@/lib/structured-data';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import { fetchServiceBySlug, fetchServiceReviewsBySlug, fetchCategoriesForServices } from '@/lib/catalog/services';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) return {};
  const categories = await fetchCategoriesForServices();
  const cat = categories.find((c) => c.id === service.category);
  return buildPageMetadata({
    title: service.title,
    description: service.description.slice(0, 160),
    path: `/services/${slug}`,
    keywords: [...service.tags, cat?.name ?? '', service.sellerName],
  });
}

export default async function ServiceDetailRoute({ params }: Props) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) notFound();

  const [reviews, categories] = await Promise.all([
    fetchServiceReviewsBySlug(slug, 4),
    fetchCategoriesForServices(),
  ]);

  const cat = categories.find((c) => c.id === service.category);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    ...(cat ? [{ label: cat.name, href: `/categories/${cat.id}` }] : []),
    { label: service.title, href: `/services/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <JsonLd data={serviceJsonLd(service, slug)} />
      <BreadcrumbOverrideProvider items={breadcrumbItems}>
        <ServiceDetail service={service} reviews={reviews} categories={categories} slug={slug} />
      </BreadcrumbOverrideProvider>
    </>
  );
}
