import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/slugs';
import { ServiceDetail } from '@/components/ServiceDetail';
import { JsonLd } from '@/components/layout/JsonLd';
import { serviceJsonLd } from '@/lib/structured-data';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';
import { categories } from '@/data/categories';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
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
  const service = getServiceBySlug(slug);
  if (!service) notFound();

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
        <ServiceDetail slug={slug} />
      </BreadcrumbOverrideProvider>
    </>
  );
}
