import { createHash } from 'node:crypto';
import { categories as homeCategories } from '../../archive/demo-data/categories';
import { productCategories, PRODUCT_CATEGORY_ALIASES } from '../../archive/demo-data/productCategories';
import { products } from '../../archive/demo-data/products';
import {
  allMarketplaceServices,
  allSellers,
  sampleReviews,
} from '../../archive/demo-data/services';
import { productReviews } from '../../archive/demo-data/reviews';
import { toHomeCategoryId } from '../../lib/catalog/category-keys';
import { getServiceSlug } from '../../lib/slugs';
import type { ProductType } from '../../types/database.types';
import type { Service } from '../../types';

export interface SeedCategory {
  key: string;
  label: string;
  slug: string;
  icon: string;
  description: string;
  sortOrder: number;
}

export interface SeedSeller {
  slug: string;
  name: string;
  tagline?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  description?: string;
  location?: string;
  categoryKey?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  sellerLevel: string;
  completedProjects?: number;
  responseTime?: string;
  joinedAt?: string;
  legacyId?: string;
}

export interface SeedProduct {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categoryKey: string;
  sellerSlug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  imageUrl: string;
  gallery?: string[];
  badge?: string;
  sellerLevel: string;
  isFeatured: boolean;
  isPromoted: boolean;
  productType: ProductType;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt?: string;
}

export interface SeedReview {
  legacyId: string;
  productSlug: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  createdAt?: string;
}

export function deterministicUuid(seed: string): string {
  const hash = createHash('sha256').update(`bridge-seed:${seed}`).digest('hex');
  const variant = ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0');
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `4${hash.slice(13, 16)}`,
    `${variant}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join('-');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function resolveCategoryKey(rawKey: string): string {
  return PRODUCT_CATEGORY_ALIASES[rawKey] ?? rawKey;
}

function serviceProductType(service: Service): ProductType {
  if (service.resultType === 'course') return 'course';
  if (service.resultType === 'digital-product') return 'digital-product';
  if (service.category === 'software') return 'software';
  if (service.category === 'video-ads') return 'ad';
  return 'service';
}

function sellerLevelFromRating(rating: number, verified?: boolean): string {
  if (verified && rating >= 4.8) return 'Top Rated';
  if (rating >= 4.5) return 'Level 2';
  return 'Rising Talent';
}

export function buildSeedCategories(): SeedCategory[] {
  const map = new Map<string, SeedCategory>();
  const seenHomeIds = new Set<string>();
  let order = 0;

  for (const category of homeCategories) {
    const homeId = toHomeCategoryId(category.id);
    if (seenHomeIds.has(homeId)) continue;
    seenHomeIds.add(homeId);
    map.set(category.id, {
      key: category.id,
      label: category.name,
      slug: category.id,
      icon: category.icon,
      description: category.description,
      sortOrder: order++,
    });
  }

  for (const category of productCategories) {
    if (category.key === 'all') continue;
    if (map.has(category.key)) continue;
    const homeId = toHomeCategoryId(category.key);
    if (seenHomeIds.has(homeId)) continue;
    seenHomeIds.add(homeId);
    map.set(category.key, {
      key: category.key,
      label: category.label,
      slug: category.key,
      icon: category.icon,
      description: `${category.label} marketplace listings on Bridge`,
      sortOrder: order++,
    });
  }

  return [...map.values()].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function buildSeedSellers(): SeedSeller[] {
  const map = new Map<string, SeedSeller>();

  for (const seller of allSellers) {
    map.set(seller.slug, {
      slug: seller.slug,
      name: seller.name,
      tagline: seller.tagline,
      avatarUrl: seller.avatar,
      coverImageUrl: seller.coverImage,
      description: seller.description,
      location: seller.location,
      categoryKey: seller.category,
      rating: seller.rating,
      reviewCount: seller.reviewCount,
      verified: seller.verified,
      sellerLevel: sellerLevelFromRating(seller.rating, seller.verified),
      completedProjects: seller.completedProjects,
      responseTime: seller.responseTime,
      joinedAt: seller.joinedDate,
      legacyId: seller.id,
    });
  }

  for (const product of products) {
    if (map.has(product.sellerSlug)) continue;
    map.set(product.sellerSlug, {
      slug: product.sellerSlug,
      name: product.sellerName,
      tagline: `${product.sellerName} on Bridge`,
      description: `${product.sellerName} delivers ${product.categoryLabel} services on Bridge.`,
      categoryKey: product.categoryKey,
      rating: product.rating,
      reviewCount: product.reviews,
      verified: product.sellerLevel === 'Top Rated',
      sellerLevel: product.sellerLevel,
      location: 'Dhaka, Bangladesh',
      completedProjects: 50,
      responseTime: '< 2 hours',
    });
  }

  for (const service of allMarketplaceServices) {
    const existingSeller = allSellers.find((s) => s.id === service.sellerId);
    const slug = existingSeller?.slug ?? slugify(service.sellerName);
    if (map.has(slug)) continue;
    map.set(slug, {
      slug,
      name: service.sellerName,
      tagline: service.sellerName,
      avatarUrl: service.sellerAvatar,
      description: `${service.sellerName} offers ${service.subcategory} on Bridge.`,
      categoryKey: resolveCategoryKey(service.category),
      rating: service.rating,
      reviewCount: service.reviewCount,
      verified: Boolean(service.isVerified),
      sellerLevel: sellerLevelFromRating(service.rating, service.isVerified),
      location: service.location ?? 'Dhaka, Bangladesh',
      legacyId: service.sellerId,
    });
  }

  return [...map.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function buildSeedProducts(): SeedProduct[] {
  const sellerByLegacyId = new Map(allSellers.map((s) => [s.id, s.slug]));
  const productsToSeed: SeedProduct[] = [];

  for (const product of products) {
    productsToSeed.push({
      slug: product.slug,
      title: product.title,
      shortDescription: product.shortDescription,
      description: product.description,
      categoryKey: product.categoryKey,
      sellerSlug: product.sellerSlug,
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      reviewsCount: product.reviews,
      deliveryTime: product.deliveryTime,
      imageUrl: product.image,
      gallery: product.gallery,
      badge: product.badge,
      sellerLevel: product.sellerLevel,
      isFeatured: Boolean(product.isFeatured),
      isPromoted: Boolean(product.isPromoted),
      productType: 'product',
      tags: product.tags,
      metadata: {
        legacyId: product.id,
        source: 'products',
        overview: product.overview,
        included: product.included,
        process: product.process,
        faqs: product.faqs,
        categoryLabel: product.categoryLabel,
      },
      createdAt: product.createdAt,
    });
  }

  for (const service of allMarketplaceServices) {
    const slug = getServiceSlug(service);
    const sellerSlug =
      sellerByLegacyId.get(service.sellerId) ?? slugify(service.sellerName);

    productsToSeed.push({
      slug,
      title: service.title,
      shortDescription: service.description.slice(0, 240),
      description: service.description,
      categoryKey: resolveCategoryKey(service.category),
      sellerSlug,
      price: service.price,
      rating: service.rating,
      reviewsCount: service.reviewCount,
      deliveryTime: service.deliveryTime,
      imageUrl: service.thumbnail,
      badge: service.popular ? 'Popular' : service.isFeatured ? 'Featured' : undefined,
      sellerLevel: sellerLevelFromRating(service.rating, service.isVerified),
      isFeatured: Boolean(service.isFeatured ?? service.popular),
      isPromoted: Boolean(service.popular),
      productType: serviceProductType(service),
      tags: service.tags,
      metadata: {
        legacyId: service.id,
        source: 'services',
        titleBn: service.titleBn,
        currency: service.currency,
        subcategory: service.subcategory,
        features: service.features,
        resultType: service.resultType,
        location: service.location,
        language: service.language,
        escrowAvailable: service.escrowAvailable,
        instantDelivery: service.instantDelivery,
        hasProtectedDemo: service.hasProtectedDemo,
      },
    });
  }

  return productsToSeed;
}

export function buildSeedReviews(serviceSlugByLegacyId: Map<string, string>): SeedReview[] {
  const reviews: SeedReview[] = [];

  for (const review of productReviews) {
    reviews.push({
      legacyId: review.id,
      productSlug: review.productSlug,
      reviewerName: review.reviewerName,
      reviewerAvatar: review.reviewerAvatar,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      verified: Boolean(review.verified),
      helpfulCount: review.helpfulCount ?? 0,
      createdAt: review.date,
    });
  }

  for (const review of sampleReviews) {
    const productSlug = serviceSlugByLegacyId.get(review.serviceId);
    if (!productSlug) continue;
    reviews.push({
      legacyId: review.id,
      productSlug,
      reviewerName: review.userName,
      reviewerAvatar: review.userAvatar || undefined,
      rating: review.rating,
      title: review.comment.slice(0, 80),
      comment: review.comment,
      verified: true,
      helpfulCount: 5,
      createdAt: review.date,
    });
  }

  return reviews;
}

export function loadDemoSeedData() {
  const categories = buildSeedCategories();
  const sellers = buildSeedSellers();
  const productsToSeed = buildSeedProducts();
  const serviceSlugByLegacyId = new Map(
    allMarketplaceServices.map((service) => [service.id, getServiceSlug(service)])
  );
  const reviews = buildSeedReviews(serviceSlugByLegacyId);

  return { categories, sellers, products: productsToSeed, reviews };
}
