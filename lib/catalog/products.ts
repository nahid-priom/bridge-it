import { listProductsFiltered, getProductBySlug, getSimilarProducts } from '@/lib/db/products';
import { getCategoryProductCounts } from '@/lib/db/products';
import { listActiveCategories } from '@/lib/db/categories';
import { listReviewsByProductId } from '@/lib/db/reviews';
import {
  mapDbProductToProduct,
  mapDbReviewToProductReview,
  mapProductCategoryRow,
} from '@/lib/db/mappers';
import { normalizeProductCategoryKey, PRODUCT_CATEGORY_KEYS } from '@/lib/catalog/category-keys';
import type { ProductFilterState } from '@/types/product';
import type { Product, ProductCategory, ProductReview } from '@/types/product';

export async function getProductCategoriesForUi(): Promise<ProductCategory[]> {
  const { data: rows } = await listActiveCategories();
  const productKeys = new Set(PRODUCT_CATEGORY_KEYS);
  const filtered = rows.filter((r) => productKeys.has(r.key as (typeof PRODUCT_CATEGORY_KEYS)[number]));
  const categories: ProductCategory[] = [
    { label: 'All Categories', key: 'all', href: '/products', icon: '🏠' },
    ...filtered.map(mapProductCategoryRow),
  ];
  return categories;
}

export async function getProductCategoryCounts(): Promise<Record<string, number>> {
  const result = await getCategoryProductCounts();
  return result.data;
}

export async function queryProductsListing(
  state: ProductFilterState
): Promise<{ products: Product[]; total: number }> {
  const result = await listProductsFiltered({
    categoryKey: state.categoryKey ?? undefined,
    q: state.q,
    sort: state.sort,
    minPrice: state.filters.priceMin,
    maxPrice: state.filters.priceMax,
    minRating: state.filters.minRating,
    deliveryTime: state.filters.deliveryTime,
    sellerLevel: state.filters.sellerLevel,
    featuredFilter: state.filters.featuredOnly,
    promotedFilter: state.filters.promotedOnly,
    verifiedOnly: state.filters.verifiedOnly,
    productType: 'product',
    limit: 120,
  });

  const products = result.data.map(mapDbProductToProduct);
  return { products, total: products.length };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const result = await getProductBySlug(slug);
  if (!result.data) return null;
  return mapDbProductToProduct(result.data);
}

export async function fetchProductReviews(
  slug: string,
  limit = 6
): Promise<ProductReview[]> {
  const productResult = await getProductBySlug(slug);
  if (!productResult.data) return [];
  const reviewsResult = await listReviewsByProductId(productResult.data.id, { limit });
  return reviewsResult.data.map((r) =>
    mapDbReviewToProductReview(r, slug)
  );
}

export async function fetchSimilarProducts(
  product: Product,
  limit = 8
): Promise<Product[]> {
  const detail = await getProductBySlug(product.slug);
  if (!detail.data) return [];

  const similar = await getSimilarProducts(
    detail.data.id,
    detail.data.category_id,
    product.tags,
    product.slug,
    limit
  );
  return similar.data.map(mapDbProductToProduct);
}

export async function getCategoryByKeyFromDb(key: string | null | undefined) {
  const normalized = normalizeProductCategoryKey(key ?? '');
  if (!normalized) return null;
  const categories = await getProductCategoriesForUi();
  return categories.find((c) => c.key === normalized) ?? null;
}
