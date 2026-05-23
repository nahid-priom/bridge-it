import { MAIN_PRODUCT_CATEGORIES, MAIN_PRODUCT_CATEGORY_EMOJI } from '@/constants/mainProductCategories';
import type { Category } from '@/types';
import type { ProductCategoryKey } from '@/types/product';

const GRADIENTS: Record<string, string> = {
  electronics: 'from-sky-500 to-blue-700',
  gadgets: 'from-violet-500 to-purple-700',
  'office-solutions': 'from-slate-500 to-slate-700',
  'smart-devices': 'from-emerald-500 to-teal-700',
  'digital-products': 'from-amber-500 to-orange-600',
};

const COLORS: Record<string, string> = {
  electronics: '#0ea5e9',
  gadgets: '#8b5cf6',
  'office-solutions': '#64748b',
  'smart-devices': '#10b981',
  'digital-products': '#f59e0b',
};

/** Product categories for /categories page */
export function getProductCategoriesForCategoriesPage(): Category[] {
  return MAIN_PRODUCT_CATEGORIES.map((cat) => ({
    id: cat.slug as unknown as Category['id'],
    name: cat.name,
    nameBn: cat.name,
    description: cat.description,
    icon: MAIN_PRODUCT_CATEGORY_EMOJI[cat.slug] ?? '📦',
    color: COLORS[cat.slug] ?? '#10b981',
    gradient: GRADIENTS[cat.slug] ?? 'from-emerald-400 to-teal-600',
    count: cat.productCount,
  }));
}
