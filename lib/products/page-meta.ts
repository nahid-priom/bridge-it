import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { fetchProductBySlug } from '@/lib/catalog/products';
import { getCategoryByKeyFromDb } from '@/lib/catalog/products';
import type { ProductsPageState } from './url';
import { shouldIndexProductsPage } from './url';

export async function buildProductsPageMetadata(state: ProductsPageState): Promise<Metadata> {
  const category = state.categoryKey ? await getCategoryByKeyFromDb(state.categoryKey) : null;
  const indexable = shouldIndexProductsPage(state);

  if (category && category.key !== 'all') {
    const title = `${category.label} Services`;
    const description = `Find trusted ${category.label} services and sellers on ${SITE_NAME}.`;
    const path = `/products?category=${category.key}`;
    return {
      ...buildPageMetadata({
        title,
        description,
        path,
        keywords: [category.label, 'services', 'marketplace', 'products'],
        noIndex: !indexable,
      }),
      alternates: { canonical: path },
    };
  }

  return {
    ...buildPageMetadata({
      title: 'Explore Products & Services',
      description: `Discover trusted digital services, products, courses, software, and creative solutions on ${SITE_NAME}.`,
      path: '/products',
      keywords: ['digital products', 'online courses', 'marketplace', 'services'],
      noIndex: !indexable,
    }),
    alternates: { canonical: '/products' },
  };
}

export async function buildProductDetailMetadata(slug: string): Promise<Metadata> {
  const product = await fetchProductBySlug(slug);
  if (!product) {
    return buildPageMetadata({
      title: 'Product Not Found',
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  const path = `/products/${product.slug}`;
  const description =
    product.shortDescription.length >= 120
      ? product.shortDescription
      : product.description.slice(0, 160).trim() +
        (product.description.length > 160 ? '…' : '');

  const meta = buildPageMetadata({
    title: product.title,
    description,
    path,
    keywords: [...product.tags, product.categoryLabel, product.sellerName],
  });

  return {
    ...meta,
    alternates: { canonical: path },
    openGraph: {
      ...meta.openGraph,
      title: `${product.title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}${path}`,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      ...meta.twitter,
      title: `${product.title} | ${SITE_NAME}`,
      description,
      images: [product.image],
    },
  };
}
