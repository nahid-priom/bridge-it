import {
  HOME_TO_PRODUCT_CATEGORY,
  isProductCategoryKey,
  normalizeProductCategoryKey,
  toHomeCategoryId,
} from '@/lib/catalog/category-keys';
import { sellerCustomUrl } from '@/lib/config/branding';
import { getCategoryStyle } from '@/lib/catalog/category-styles';
import type {
  DbCategory,
  DbProductListItem,
  DbReview,
  DbSeller,
  ProductType,
  ProductWithRelations,
} from '@/types/database.types';
import type { Category, CategoryType, Review, SearchCatalogItem, Service } from '@/types';
import type { Product, ProductCategory, ProductCategoryKey, ProductReview } from '@/types/product';

type ProductMeta = {
  legacyId?: string;
  source?: string;
  overview?: string;
  included?: string[];
  process?: string[];
  faqs?: Product['faqs'];
  categoryLabel?: string;
  titleBn?: string;
  currency?: string;
  subcategory?: string;
  features?: string[];
  resultType?: string;
  location?: string;
  language?: string;
  escrowAvailable?: boolean;
  instantDelivery?: boolean;
  hasProtectedDemo?: boolean;
};

function meta(row: { metadata?: unknown }): ProductMeta {
  return (row.metadata ?? {}) as ProductMeta;
}

function tagsFromRow(row: ProductWithRelations | DbProductListItem & { product_tags?: { tag: string }[] }) {
  const withTags = row as ProductWithRelations;
  return withTags.product_tags?.map((t) => t.tag) ?? [];
}

function galleryFromRow(row: ProductWithRelations): string[] | undefined {
  const images = row.product_images
    ?.slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);
  if (!images?.length) return undefined;
  const primary = row.image_url;
  const unique = [...new Set(images.filter((u) => u !== primary))];
  if (!unique.length) return images.length > 1 ? images : undefined;
  return [primary, ...unique].filter(Boolean);
}

export function mapCategoryRow(row: DbCategory, productCount = 0): Category {
  const style = getCategoryStyle(row.key);
  const homeId = toHomeCategoryId(row.key) as CategoryType;
  return {
    id: homeId,
    name: row.label,
    nameBn: style.nameBn ?? row.label,
    icon: row.icon,
    description: row.description,
    color: style.color,
    gradient: style.gradient,
    count: productCount,
  };
}

export function mapProductCategoryRow(row: DbCategory): ProductCategory {
  const key = normalizeProductCategoryKey(row.key) ?? (row.key as ProductCategoryKey);
  return {
    label: row.label,
    key: key === row.key ? key : (row.key as ProductCategoryKey | 'all'),
    href: row.key === 'all' ? '/products' : `/products?category=${key}`,
    icon: row.icon,
  };
}

export function mapDbProductToProduct(
  row: ProductWithRelations | (DbProductListItem & Partial<ProductWithRelations>)
): Product {
  const m = meta(row);
  const category = 'categories' in row ? row.categories : null;
  const seller = 'sellers' in row ? row.sellers : null;
  const categoryKey =
    normalizeProductCategoryKey(category?.key ?? '') ??
    (isProductCategoryKey(category?.key ?? '') ? (category!.key as ProductCategoryKey) : 'digital-products');

  return {
    id: m.legacyId ?? row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    overview: m.overview,
    categoryKey,
    categoryLabel: m.categoryLabel ?? category?.label ?? categoryKey,
    sellerName: seller?.name ?? '',
    sellerSlug: seller?.slug ?? '',
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    rating: Number(row.rating),
    reviews: row.reviews_count,
    deliveryTime: row.delivery_time,
    image: row.image_url,
    gallery: 'product_images' in row ? galleryFromRow(row as ProductWithRelations) : undefined,
    badge: row.badge ?? undefined,
    tags: tagsFromRow(row as ProductWithRelations),
    sellerLevel: row.seller_level,
    isFeatured: row.is_featured,
    isPromoted: row.is_promoted,
    included: m.included,
    process: m.process,
    faqs: m.faqs,
    createdAt: row.created_at?.slice(0, 10),
  };
}

function serviceCategoryFromKey(categoryKey: string | undefined): CategoryType {
  if (!categoryKey) return 'digital-products';
  const home = toHomeCategoryId(categoryKey);
  return home as CategoryType;
}

export function mapDbProductToService(row: ProductWithRelations): Service {
  const m = meta(row);
  const category = row.categories;
  const seller = row.sellers;
  const categoryKey = category?.key ?? '';
  const homeCategory = serviceCategoryFromKey(categoryKey);
  const resultType = (m.resultType ?? 'service') as Service['resultType'];

  return {
    id: m.legacyId ?? row.id,
    slug: row.slug,
    title: row.title,
    titleBn: m.titleBn,
    description: row.description,
    price: Number(row.price),
    currency: m.currency ?? 'BDT',
    deliveryTime: row.delivery_time,
    thumbnail: row.image_url,
    category: homeCategory,
    subcategory: m.subcategory ?? category?.label ?? '',
    rating: Number(row.rating),
    reviewCount: row.reviews_count,
    sellerId: m.legacyId?.startsWith('s') ? m.legacyId : row.seller_id,
    sellerSlug: seller?.slug,
    sellerName: seller?.name ?? '',
    sellerAvatar:
      (m as { sellerAvatar?: string }).sellerAvatar ??
      'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
    features: m.features ?? tagsFromRow(row).slice(0, 6),
    demoItems: [],
    tags: tagsFromRow(row),
    popular: row.is_promoted,
    isVerified: row.seller_level === 'Top Rated',
    isFeatured: row.is_featured,
    hasProtectedDemo: m.hasProtectedDemo ?? false,
    location: m.location,
    language: m.language,
    escrowAvailable: m.escrowAvailable,
    instantDelivery: m.instantDelivery ?? row.delivery_time.toLowerCase() === 'instant',
    resultType,
  };
}

export function mapDbReviewToProductReview(row: DbReview, productSlug: string): ProductReview {
  return {
    id: row.id,
    productSlug,
    reviewerName: row.reviewer_name,
    reviewerAvatar: row.reviewer_avatar ?? undefined,
    rating: Number(row.rating),
    date: row.created_at.slice(0, 10),
    title: row.title,
    comment: row.comment,
    helpfulCount: row.helpful_count,
    verified: row.verified,
  };
}

export function mapDbReviewToServiceReview(row: DbReview, serviceId: string): Review {
  return {
    id: row.id,
    userId: row.id,
    userName: row.reviewer_name,
    userAvatar: row.reviewer_avatar ?? '',
    rating: Number(row.rating),
    comment: row.comment,
    date: row.created_at.slice(0, 10),
    serviceId,
  };
}

export function mapDbSellerToSeller(row: DbSeller): import('@/types').Seller {
  const categoryKey = row.category_key ?? 'digital-products';
  const homeCategory = serviceCategoryFromKey(
    HOME_TO_PRODUCT_CATEGORY[categoryKey] ?? categoryKey
  );

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    avatar:
      row.avatar_url ??
      'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200',
    coverImage:
      row.cover_image_url ??
      'https://images.pexels.com/photos/8833485/pexels-photo-8833485.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1200',
    category: homeCategory,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    verified: row.verified,
    description: row.description ?? '',
    tagline: row.tagline ?? '',
    location: row.location ?? 'Dhaka, Bangladesh',
    joinedDate: row.joined_at?.slice(0, 10) ?? '',
    completedProjects: row.completed_projects,
    responseTime: row.response_time ?? '< 2 hours',
    services: [],
    gallery: [],
    customUrl: sellerCustomUrl(row.slug),
  };
}

export function mapProductToSearchListing(service: Service): SearchCatalogItem {
  return { kind: 'listing', service };
}

export function mapSellerToSearchItem(
  seller: import('@/types').Seller,
  categoryName: string
): SearchCatalogItem {
  return {
    kind: 'seller',
    id: `seller-result-${seller.id}`,
    title: seller.name,
    titleBn: seller.name,
    description: seller.description,
    thumbnail: seller.coverImage,
    category: seller.category,
    categoryName,
    sellerId: seller.id,
    sellerSlug: seller.slug,
    sellerName: seller.name,
    sellerAvatar: seller.avatar,
    rating: seller.rating,
    reviewCount: seller.reviewCount,
    location: seller.location,
    language: 'English & Bengali',
    isVerified: seller.verified,
    isFeatured: seller.rating >= 4.8,
    tags: [seller.category, 'seller', seller.name.toLowerCase(), categoryName.toLowerCase()],
  };
}

export function mapDbSellerToSearchItem(seller: import('@/types').Seller, categoryName: string) {
  return mapSellerToSearchItem(seller, categoryName);
}

export const SERVICE_PRODUCT_TYPES: ProductType[] = [
  'service',
  'course',
  'software',
  'ad',
  'digital-product',
];

export function isServiceProductType(type: ProductType): boolean {
  return SERVICE_PRODUCT_TYPES.includes(type);
}
