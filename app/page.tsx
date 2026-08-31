import { HomePage } from '@/components/home/HomePage';
import { buildPageMetadata } from '@/lib/metadata';
import { HOME_SEO_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/site';
import { getActiveCategories } from '@/lib/services/categories.service';
import { getPublishedProducts, getPopularProducts, getFeaturedProducts } from '@/lib/services/products.service';
import { getFeaturedPortfolio } from '@/lib/services/portfolio.service';
import { getApprovedReviews, reviewsToTestimonials } from '@/lib/services/reviews.service';
import { mergeTestimonials } from '@/data/homeContent';
import type { MarketplaceHomeData } from '@/types/marketplace';
import type { MarketplaceProduct } from '@/types/marketplaceProduct';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: HOME_SEO_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  path: '/',
});

function mapToMarketplaceHome(categories: Awaited<ReturnType<typeof getActiveCategories>>, products: Awaited<ReturnType<typeof getPublishedProducts>>): MarketplaceHomeData {
  const services = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.name,
    shortDescription: p.short_description ?? '',
    sellerName: 'Bridge IT Park',
    sellerLevel: 'Official',
    priceFrom: Number(p.starting_price),
    currency: p.currency,
    deliveryDays: parseInt(p.delivery_time ?? '0') || null,
    rating: 5,
    reviewCount: 0,
    categorySlug: p.category?.slug ?? '',
    rowGroup: (p.category?.slug ?? 'software-solutions') as import('@/types/marketplace').MarketplaceRowGroup,
    isPopular: p.popular,
    isFeatured: p.featured,
    thumbnailType: p.thumbnail ? ('image' as const) : ('gradient' as const),
    thumbnailUrl: p.thumbnail,
    tags: p.keywords,
  }));

  return {
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      subtitle: c.description ?? '',
      description: c.description ?? '',
      icon: c.icon ?? '💼',
      serviceCount: products.filter((p) => p.category_id === c.id).length,
      sortOrder: c.sort_order,
      isFeatured: true,
    })),
    services: services as import('@/types/marketplace').MarketplaceService[],
  };
}

function mapToMarketplaceProducts(products: Awaited<ReturnType<typeof getPopularProducts>>): MarketplaceProduct[] {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.short_description ?? '',
    fullDescription: p.full_description ?? '',
    price: Number(p.starting_price),
    comparePrice: null,
    currency: p.currency,
    categoryId: p.category_id,
    categorySlug: p.category?.slug ?? '',
    categoryName: p.category?.name ?? '',
    thumbnailUrl: p.thumbnail,
    gallery: p.cover_image ? [p.cover_image] : [],
    stock: 0,
    brand: 'Bridge IT Park',
    isFeatured: p.featured,
    isPopular: p.popular,
    rating: 5,
    reviewCount: 0,
    tags: p.keywords,
  })) as MarketplaceProduct[];
}

export default async function Home() {
  const [categories, allProducts, popularProducts, portfolio, reviews] = await Promise.all([
    getActiveCategories(),
    getPublishedProducts({ limit: 50 }),
    getPopularProducts(12),
    getFeaturedPortfolio(6),
    getApprovedReviews(6),
  ]);

  const marketplace = mapToMarketplaceHome(categories, allProducts.length > 0 ? allProducts : popularProducts);
  const products = mapToMarketplaceProducts(popularProducts.length > 0 ? popularProducts : allProducts.slice(0, 12));
  const testimonials = mergeTestimonials(reviewsToTestimonials(reviews));

  return (
    <HomePage
      marketplace={marketplace}
      popularProducts={products}
      testimonials={testimonials}
      portfolio={portfolio}
    />
  );
}
