import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';
import { getCategoryBySlug } from './url';
import type { ProductCategoryKey } from '@/types/product';

export function buildProductsBreadcrumbItems(
  categoryKey: ProductCategoryKey | null
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  const category = getCategoryBySlug(categoryKey);
  if (category && category.key !== 'all') {
    items.push({
      label: category.label,
      href: `/products?category=${category.key}`,
    });
  }

  return items;
}
