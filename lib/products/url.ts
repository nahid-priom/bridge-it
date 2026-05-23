import {
  getCategoryByKey,
  isProductCategoryKey,
  PRODUCT_CATEGORY_ALIASES,
} from '@/data/productCategories';
import { DEFAULT_PRODUCT_LISTING_FILTERS } from '@/types/product';
import type {
  ProductCategoryKey,
  ProductFilterState,
  ProductListingFilters,
} from '@/types/product';
import type { SearchSortOption } from '@/lib/searchFilter';

const VALID_SORTS: SearchSortOption[] = [
  'relevance',
  'popular',
  'rating',
  'price-low',
  'price-high',
  'newest',
];

export type ProductsPageState = ProductFilterState;

export const DEFAULT_PRODUCTS_PAGE_STATE: ProductsPageState = {
  categoryKey: null,
  q: '',
  sort: 'popular',
  filters: { ...DEFAULT_PRODUCT_LISTING_FILTERS },
};

/** Convert URLSearchParams to a plain record for parseProductsSearchParams. */
export function searchParamsToRecord(params: URLSearchParams): Record<string, string> {
  const record: Record<string, string> = {};
  params.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseCategoryKey(raw: string | undefined): ProductCategoryKey | null {
  if (!raw?.trim() || raw.trim().toLowerCase() === 'all') return null;
  const slug = raw.trim().toLowerCase();
  const normalized = PRODUCT_CATEGORY_ALIASES[slug] ?? slug;
  return isProductCategoryKey(normalized) ? normalized : null;
}

function parseSort(raw: string | undefined): SearchSortOption {
  if (!raw) return 'popular';
  return VALID_SORTS.includes(raw as SearchSortOption) ? (raw as SearchSortOption) : 'popular';
}

function parsePrice(raw: string | undefined): { min: number; max: number } {
  if (!raw) return { min: 0, max: 200000 };
  const [a, b] = raw.split('-').map((n) => parseInt(n, 10));
  if (Number.isNaN(a) || Number.isNaN(b)) return { min: 0, max: 200000 };
  return { min: Math.min(a, b), max: Math.max(a, b) };
}

function parseRating(raw: string | undefined): number {
  const n = parseInt(raw ?? '', 10);
  if (Number.isNaN(n) || n < 1 || n > 5) return 0;
  return n;
}

function parseBool(raw: string | undefined): boolean {
  return raw === '1' || raw === 'true';
}

/** Read URL search params into products page state (source of truth). */
export function parseProductsSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): ProductsPageState {
  const categoryKey = parseCategoryKey(first(searchParams.category));
  const q = first(searchParams.q)?.trim() ?? '';
  const sort = parseSort(first(searchParams.sort));
  const price = parsePrice(first(searchParams.price));

  const filters: ProductListingFilters = {
    ...DEFAULT_PRODUCT_LISTING_FILTERS,
    priceMin: price.min,
    priceMax: price.max,
    minRating: parseRating(first(searchParams.rating)),
    deliveryTime: (() => {
      const d = first(searchParams.delivery);
      const allowed = ['all', 'instant', '1-3', '4-7', '8-14', '15+'] as const;
      return d && (allowed as readonly string[]).includes(d)
        ? (d as ProductListingFilters['deliveryTime'])
        : 'all';
    })(),
    sellerLevel: (() => {
      const s = first(searchParams.sellerLevel);
      const allowed = ['all', 'Top Rated', 'Level 2', 'Rising Talent'] as const;
      return s && (allowed as readonly string[]).includes(s)
        ? (s as ProductListingFilters['sellerLevel'])
        : 'all';
    })(),
    verifiedOnly: parseBool(first(searchParams.verified)),
    featuredOnly: parseBool(first(searchParams.featured)),
    promotedOnly: parseBool(first(searchParams.promoted)),
  };

  return { categoryKey, q, sort, filters };
}

/** Serialize state to URLSearchParams (omit defaults). */
export function productsStateToParams(state: ProductsPageState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.categoryKey) params.set('category', state.categoryKey);
  if (state.q) params.set('q', state.q);
  if (state.sort !== 'popular') params.set('sort', state.sort);

  const { filters } = state;
  if (filters.priceMin > 0 || filters.priceMax < 200000) {
    params.set('price', `${filters.priceMin}-${filters.priceMax}`);
  }
  if (filters.minRating > 0) params.set('rating', String(filters.minRating));
  if (filters.deliveryTime !== 'all') params.set('delivery', filters.deliveryTime);
  if (filters.sellerLevel !== 'all') params.set('sellerLevel', filters.sellerLevel);
  if (filters.verifiedOnly) params.set('verified', '1');
  if (filters.featuredOnly) params.set('featured', '1');
  if (filters.promotedOnly) params.set('promoted', '1');

  return params;
}

export function buildProductsHref(state: ProductsPageState): string {
  const qs = productsStateToParams(state).toString();
  return qs ? `/products?${qs}` : '/products';
}

export function getCategoryBySlug(slug: string | null | undefined) {
  return getCategoryByKey(slug);
}

/** Index clean category (and optional q) URLs — not heavy filter combos. */
export function shouldIndexProductsPage(state: ProductsPageState): boolean {
  const { filters } = state;
  const hasHeavyFilters =
    filters.priceMin > 0 ||
    filters.priceMax < 200000 ||
    filters.minRating > 0 ||
    filters.deliveryTime !== 'all' ||
    filters.sellerLevel !== 'all' ||
    filters.verifiedOnly ||
    filters.featuredOnly ||
    filters.promotedOnly;

  if (hasHeavyFilters) return false;
  if (state.categoryKey) return true;
  return !state.q;
}
