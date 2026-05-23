import type { ProductCategory, ProductCategoryKey } from '@/types/product';

export const productCategories: ProductCategory[] = [
  { label: 'All Categories', key: 'all', href: '/products', icon: '🏠' },
  {
    label: '2D Animation',
    key: '2d-animation',
    href: '/products?category=2d-animation',
    icon: '🎨',
  },
  {
    label: '3D Animation',
    key: '3d-animation',
    href: '/products?category=3d-animation',
    icon: '🎬',
  },
  {
    label: 'Video Advertising',
    key: 'video-advertising',
    href: '/products?category=video-advertising',
    icon: '📹',
  },
  {
    label: 'Software Company',
    key: 'software-company',
    href: '/products?category=software-company',
    icon: '💻',
  },
  {
    label: 'Digital Products',
    key: 'digital-products',
    href: '/products?category=digital-products',
    icon: '📦',
  },
  {
    label: 'Online Courses',
    key: 'online-courses',
    href: '/products?category=online-courses',
    icon: '📚',
  },
  {
    label: 'Boosting Agency',
    key: 'boosting-agency',
    href: '/products?category=boosting-agency',
    icon: '🚀',
  },
  {
    label: 'Editing Services',
    key: 'editing-services',
    href: '/products?category=editing-services',
    icon: '✂️',
  },
];

const CATEGORY_KEYS = new Set(
  productCategories
    .map((c) => c.key)
    .filter((k): k is ProductCategoryKey => k !== 'all')
);

/** Legacy marketplace category slugs → product category keys */
export const PRODUCT_CATEGORY_ALIASES: Record<string, ProductCategoryKey> = {
  'video-ads': 'video-advertising',
  software: 'software-company',
  courses: 'online-courses',
  editing: 'editing-services',
};

export function getCategoryByKey(key: string | null | undefined) {
  if (!key || key === 'all') return null;
  const normalized = PRODUCT_CATEGORY_ALIASES[key] ?? key;
  if (!CATEGORY_KEYS.has(normalized as ProductCategoryKey)) return null;
  return productCategories.find((c) => c.key === normalized) ?? null;
}

export function isProductCategoryKey(key: string): key is ProductCategoryKey {
  return CATEGORY_KEYS.has(key as ProductCategoryKey);
}
