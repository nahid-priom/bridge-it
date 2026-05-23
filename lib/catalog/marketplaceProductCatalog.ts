import { getMarketplaceProductHomeData, getMarketplaceProductBySlugResolved } from '@/lib/marketplace/getMarketplaceProducts';
import { MAIN_PRODUCT_CATEGORIES, MAIN_PRODUCT_CATEGORY_EMOJI } from '@/constants/mainProductCategories';
import { isMainProductCategorySlug } from '@/constants/mainProductCategories';
import type { MarketplaceProduct } from '@/types/marketplaceProduct';
import type { Product, ProductCategory, ProductCategoryKey, ProductFilterState } from '@/types/product';
import type { SearchSortOption } from '@/lib/searchFilter';

function mapToProduct(p: MarketplaceProduct): Product {
  const stockLabel =
    p.stock <= 0 ? 'Out of stock' : p.stock > 50 ? 'In stock' : `${p.stock} in stock`;

  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    shortDescription: p.shortDescription ?? '',
    description: p.fullDescription ?? p.shortDescription ?? '',
    categoryKey: p.categorySlug as ProductCategoryKey,
    categoryLabel: p.categoryName,
    sellerName: p.brand ?? 'Official Store',
    sellerSlug: 'official-store',
    price: p.price,
    oldPrice: p.comparePrice ?? undefined,
    rating: p.rating,
    reviews: p.reviewCount,
    deliveryTime: stockLabel,
    image: p.thumbnailUrl ?? '',
    gallery: p.gallery.length > 0 ? p.gallery : undefined,
    badge: p.isFeatured ? 'Featured' : p.isPopular ? 'Popular' : undefined,
    tags: p.tags,
    sellerLevel: 'Official Seller',
    isFeatured: p.isFeatured,
  };
}

export async function getProductCategoriesForUi(): Promise<ProductCategory[]> {
  const { categories } = await getMarketplaceProductHomeData();
  const fromDb = categories.length > 0 ? categories : [];

  const items: ProductCategory[] = [
    { label: 'All Categories', key: 'all', href: '/products', icon: '🏠' },
    ...MAIN_PRODUCT_CATEGORIES.map((cat) => {
      const dbCat = fromDb.find((c) => c.slug === cat.slug);
      return {
        label: cat.name,
        key: cat.slug as ProductCategoryKey,
        href: `/products?category=${cat.slug}`,
        icon: MAIN_PRODUCT_CATEGORY_EMOJI[cat.slug] ?? '📦',
      };
    }),
  ];
  return items;
}

export async function getProductCategoryCounts(): Promise<Record<string, number>> {
  const { products } = await getMarketplaceProductHomeData();
  const counts: Record<string, number> = { all: products.length };
  for (const cat of MAIN_PRODUCT_CATEGORIES) {
    counts[cat.slug] = products.filter((p) => p.categorySlug === cat.slug).length;
  }
  return counts;
}

function filterProducts(
  products: MarketplaceProduct[],
  state: ProductFilterState
): MarketplaceProduct[] {
  let list = [...products];

  if (state.categoryKey && isMainProductCategorySlug(state.categoryKey)) {
    list = list.filter((p) => p.categorySlug === state.categoryKey);
  }

  const q = state.q.trim().toLowerCase();
  if (q) {
    list = list.filter((p) => {
      const blob = `${p.name} ${p.shortDescription} ${p.brand} ${p.tags.join(' ')}`.toLowerCase();
      return blob.includes(q);
    });
  }

  const { filters } = state;
  if (filters.priceMin > 0) list = list.filter((p) => p.price >= filters.priceMin);
  if (filters.priceMax < 200000) list = list.filter((p) => p.price <= filters.priceMax);
  if (filters.minRating > 0) list = list.filter((p) => p.rating >= filters.minRating);
  if (filters.featuredOnly) list = list.filter((p) => p.isFeatured);

  return list;
}

function sortProducts(
  products: MarketplaceProduct[],
  sort: SearchSortOption
): MarketplaceProduct[] {
  const list = [...products];
  switch (sort) {
    case 'price-low':
      return list.sort((a, b) => a.price - b.price);
    case 'price-high':
      return list.sort((a, b) => b.price - a.price);
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return list;
    case 'popular':
    case 'relevance':
    default:
      return list.sort((a, b) => {
        const f = Number(b.isFeatured) - Number(a.isFeatured);
        if (f !== 0) return f;
        return b.reviewCount - a.reviewCount;
      });
  }
}

export async function queryProductsListing(
  state: ProductFilterState
): Promise<{ products: Product[]; total: number }> {
  const { products } = await getMarketplaceProductHomeData();
  const filtered = sortProducts(filterProducts(products, state), state.sort);
  const mapped = filtered.map(mapToProduct);
  return { products: mapped, total: mapped.length };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const mp = await getMarketplaceProductBySlugResolved(slug);
  if (!mp) return null;
  return mapToProduct(mp);
}

export async function fetchSimilarProducts(
  product: Product,
  limit = 8
): Promise<Product[]> {
  const { products } = await getMarketplaceProductHomeData();
  const similar = products
    .filter((p) => p.categorySlug === product.categoryKey && p.slug !== product.slug)
    .slice(0, limit);
  return similar.map(mapToProduct);
}

export async function fetchProductReviews(slug: string, limit = 6) {
  void slug;
  void limit;
  return [];
}

export async function getCategoryByKeyFromDb(key: string | null | undefined) {
  const categories = await getProductCategoriesForUi();
  if (!key) return null;
  return categories.find((c) => c.key === key) ?? null;
}
