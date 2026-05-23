import { buildPageMetadata } from '@/lib/metadata';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
import { HomePage } from '@/components/home/HomePage';
import {
  getHomeCategories,
  getHomeFeaturedServices,
  getHomeTopSellers,
  getHomeTestimonials,
} from '@/lib/catalog/home';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: '/',
});

export default async function Home() {
  const [categories, featuredServices, topSellers, testimonials] = await Promise.all([
    getHomeCategories(),
    getHomeFeaturedServices(8),
    getHomeTopSellers(8),
    getHomeTestimonials(6),
  ]);

  return (
    <HomePage
      categories={categories}
      featuredServices={featuredServices}
      topSellers={topSellers}
      testimonials={testimonials}
    />
  );
}
