import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getAllServiceSlugs, getAllSellerSlugs } from '@/lib/slugs-server';
import { listCategorySlugs } from '@/lib/catalog/categories';
import { listProductSlugs } from '@/lib/db/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  const [categorySlugs, serviceSlugs, sellerSlugs, productSlugs] = await Promise.all([
    listCategorySlugs(),
    getAllServiceSlugs(),
    getAllSellerSlugs(),
    listProductSlugs(['product']),
  ]);

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const sellerRoutes = sellerSlugs.map((slug) => ({
    url: `${SITE_URL}/sellers/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const productRoutes = productSlugs.data.map((slug) => ({
    url: `${SITE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...sellerRoutes, ...productRoutes];
}
