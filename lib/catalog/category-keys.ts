import {
  MAIN_PRODUCT_CATEGORY_SLUGS,
  isMainProductCategorySlug,
} from '@/constants/mainProductCategories';
import type { ProductCategoryKey } from '@/types/product';

export const PRODUCT_CATEGORY_KEYS: ProductCategoryKey[] = [
  ...MAIN_PRODUCT_CATEGORY_SLUGS,
] as ProductCategoryKey[];

const CATEGORY_KEY_SET = new Set<string>(PRODUCT_CATEGORY_KEYS);

export const PRODUCT_CATEGORY_ALIASES: Record<string, ProductCategoryKey> = {};

/** Legacy service homepage ids → product keys (minimal compatibility) */
export const HOME_TO_PRODUCT_CATEGORY: Record<string, ProductCategoryKey> = {
  'web-development': 'electronics',
  software: 'digital-products',
  'digital-marketing': 'gadgets',
};

export const PRODUCT_TO_HOME_CATEGORY: Partial<Record<ProductCategoryKey, string>> = {};

export function isProductCategoryKey(key: string): key is ProductCategoryKey {
  return CATEGORY_KEY_SET.has(key) || isMainProductCategorySlug(key);
}

export function normalizeProductCategoryKey(
  key: string | null | undefined
): ProductCategoryKey | null {
  if (!key?.trim() || key === 'all') return null;
  const normalized = PRODUCT_CATEGORY_ALIASES[key] ?? key.trim().toLowerCase();
  return isProductCategoryKey(normalized) ? (normalized as ProductCategoryKey) : null;
}

export function toHomeCategoryId(key: string): string {
  return key;
}
