import { HomePage } from '@/components/home/HomePage';
import { buildPageMetadata } from '@/lib/metadata';
import { HOME_SEO_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/site';
import { getFeaturedProducts } from '@/lib/services/products.service';
import { getFeaturedPortfolio } from '@/lib/services/portfolio.service';
import { getApprovedReviews, reviewsToTestimonials } from '@/lib/services/reviews.service';
import { mergeTestimonials } from '@/data/homeContent';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: HOME_SEO_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  path: '/',
});

export default async function Home() {
  const [featuredProducts, portfolio, reviews] = await Promise.all([
    getFeaturedProducts(12),
    getFeaturedPortfolio(6),
    getApprovedReviews(6),
  ]);

  const testimonials = mergeTestimonials(reviewsToTestimonials(reviews));

  return (
    <HomePage
      featuredProducts={featuredProducts}
      testimonials={testimonials}
      portfolio={portfolio}
    />
  );
}
