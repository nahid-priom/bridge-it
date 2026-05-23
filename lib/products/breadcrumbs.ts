import type { BreadcrumbItem } from '@/lib/seo/breadcrumbs';
import { findCategoryInList } from './url';
import type { ProductCategory, ProductCategoryKey } from '@/types/product';

export function buildProductsBreadcrumbItems(
  categoryKey: ProductCategoryKey | null,
  categories: ProductCategory[]
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  const category = findCategoryInList(categories, categoryKey);
  if (category && category.key !== 'all') {
    items.push({
      label: category.label,
      href: `/products?category=${category.key}`,
    });
  }

  return items;
}
