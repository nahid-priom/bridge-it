import {
  MAIN_CATEGORY_EMOJI,
  MAIN_MARKETPLACE_CATEGORIES,
} from '@/constants/mainMarketplaceCategories';
import { marketplaceCategorySearchUrl } from '@/lib/routes';
import type { Category, CategoryType } from '@/types';

const CATEGORY_GRADIENTS: Record<string, string> = {
  'software-development': 'from-blue-500 to-blue-700',
  'web-development': 'from-emerald-400 to-cyan-600',
  'app-development': 'from-sky-400 to-indigo-600',
  'digital-marketing': 'from-amber-400 to-rose-500',
  'ai-automations': 'from-fuchsia-400 to-blue-600',
};

const CATEGORY_COLORS: Record<string, string> = {
  'software-development': '#2563EB',
  'web-development': '#10B981',
  'app-development': '#3B82F6',
  'digital-marketing': '#F59E0B',
  'ai-automations': '#A855F7',
};

/** Five main marketplace categories for nav, footer, and /categories */
export function getMainMarketplaceCategoriesForUi(): Category[] {
  return MAIN_MARKETPLACE_CATEGORIES.map((cat) => ({
    id: cat.slug as CategoryType,
    name: cat.name,
    nameBn: cat.name,
    description: cat.short,
    icon: MAIN_CATEGORY_EMOJI[cat.slug] ?? '📦',
    color: CATEGORY_COLORS[cat.slug] ?? '#10B981',
    gradient: CATEGORY_GRADIENTS[cat.slug] ?? 'from-emerald-400 to-teal-600',
    count: cat.serviceCount,
  }));
}

export function mainCategorySearchHref(slug: string): string {
  return marketplaceCategorySearchUrl(slug);
}
