import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/layout/JsonLd';
import { SITE_URL } from '@/lib/site';
import { getCategoryBySlug, listProjectCards } from '@/src/features/ecommerce-showcase/api/projects';
import { ProjectGrid } from '@/src/features/ecommerce-showcase/public/ProjectGrid';

export const revalidate = 60;

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return buildPageMetadata({ title: 'E-commerce category', path: `/ecommerce/${category}` });
  return buildPageMetadata({
    title: `${cat.name} E-commerce Websites`,
    description:
      cat.description ||
      `Browse ${cat.name.toLowerCase()} e-commerce website designs and request a custom build.`,
    path: `/ecommerce/${cat.slug}`,
    keywords: [`${cat.name} ecommerce website`, 'custom ecommerce website Bangladesh'],
  });
}

export default async function EcommerceCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();
  const { items, total } = await listProjectCards({ category: cat.slug, limit: 24 });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} e-commerce websites`,
    description:
      cat.description || `Custom ${cat.name.toLowerCase()} storefront designs you can preview page by page.`,
    url: `${SITE_URL}/ecommerce/${cat.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total,
      itemListElement: items.slice(0, 12).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/websites/${item.slug}`,
        name: item.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
        <h1 className="font-display text-3xl md:text-4xl font-black text-[#0f2744] dark:text-white">
          {cat.name} e-commerce websites
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          {cat.description || `Custom ${cat.name.toLowerCase()} storefront designs you can preview page by page.`}
        </p>
        <div className="mt-8">
          <ProjectGrid projects={items} priorityFirst />
        </div>
      </div>
    </>
  );
}
