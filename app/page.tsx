import { buildPageMetadata } from '@/lib/metadata';
import { HOME_SEO_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/site';
import { HomePage } from '@/components/home/HomePage';
import { getHomeTestimonials } from '@/lib/catalog/home';
import { getMarketplaceHomeData } from '@/lib/marketplace/getMarketplaceData';
import {
  getMarketplaceProductHomeData,
  getPopularMarketplaceProducts,
} from '@/lib/marketplace/getMarketplaceProducts';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: HOME_SEO_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  path: '/',
});

export default async function Home() {
  const [marketplace, productData, testimonials] = await Promise.all([
    getMarketplaceHomeData(),
    getMarketplaceProductHomeData(),
    getHomeTestimonials(6),
  ]);

  const popularProducts = getPopularMarketplaceProducts(productData.products, 12);

  return (
    <HomePage
      marketplace={marketplace}
      popularProducts={popularProducts}
      testimonials={testimonials}
    />
  );
}
