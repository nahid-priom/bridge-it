import type { ProductCategoryKey } from '@/types/product';

export const PRODUCT_CATEGORY_KEYS: ProductCategoryKey[] = [
  '2d-animation',
  '3d-animation',
  'video-advertising',
  'software-company',
  'digital-products',
  'online-courses',
  'boosting-agency',
  'editing-services',
];

const CATEGORY_KEY_SET = new Set<string>(PRODUCT_CATEGORY_KEYS);

/** Legacy marketplace category slugs → product category keys */
export const PRODUCT_CATEGORY_ALIASES: Record<string, ProductCategoryKey> = {
  'video-ads': 'video-advertising',
  software: 'software-company',
  courses: 'online-courses',
  editing: 'editing-services',
};

/** Product category key → homepage CategoryType id */
export const PRODUCT_TO_HOME_CATEGORY: Partial<Record<ProductCategoryKey, string>> = {
  'video-advertising': 'video-ads',
  'software-company': 'software',
  'online-courses': 'courses',
  'editing-services': 'editing',
};

/** Homepage / service CategoryType → product category key */
export const HOME_TO_PRODUCT_CATEGORY: Record<string, ProductCategoryKey> = {
  'video-ads': 'video-advertising',
  software: 'software-company',
  courses: 'online-courses',
  editing: 'editing-services',
  '2d-animation': '2d-animation',
  '3d-animation': '3d-animation',
  'digital-products': 'digital-products',
  'boosting-agency': 'boosting-agency',
  'web-development': 'software-company',
  'mobile-apps': 'software-company',
  'ui-ux-design': 'digital-products',
  'digital-marketing': 'boosting-agency',
};

export function isProductCategoryKey(key: string): key is ProductCategoryKey {
  return CATEGORY_KEY_SET.has(key);
}

export function normalizeProductCategoryKey(
  key: string | null | undefined
): ProductCategoryKey | null {
  if (!key?.trim() || key === 'all') return null;
  const normalized = PRODUCT_CATEGORY_ALIASES[key] ?? key;
  return isProductCategoryKey(normalized) ? normalized : null;
}

export function toHomeCategoryId(key: string): string {
  if (isProductCategoryKey(key)) {
    return PRODUCT_TO_HOME_CATEGORY[key] ?? key;
  }
  return key;
}
