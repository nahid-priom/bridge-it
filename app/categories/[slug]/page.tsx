import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { categories } from '@/data/categories';
import { CategoryDetail } from '@/components/CategoryDetail';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { BreadcrumbOverrideProvider } from '@/components/seo/BreadcrumbOverride';
import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';
import type { CategoryType } from '@/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);
  if (!category) return {};
  return buildPageMetadata({
    title: `${category.name} Services`,
    description: category.description,
    path: `/categories/${slug}`,
    keywords: [category.name, category.nameBn, 'Bridge marketplace'],
  });
}

export default async function CategoryDetailRoute({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);
  if (!category) notFound();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: category.name, href: `/categories/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BreadcrumbOverrideProvider items={breadcrumbItems}>
        <CategoryDetail categorySlug={slug as CategoryType} />
      </BreadcrumbOverrideProvider>
    </>
  );
}
