import type { CategoryType } from '@/types';
import { MAIN_CATEGORY_SLUGS } from '@/constants/mainMarketplaceCategories';
import { MAIN_PRODUCT_CATEGORY_SLUGS } from '@/constants/mainProductCategories';

/** Visual styling for category cards (not stored in DB). */
export const CATEGORY_STYLES: Record<
  string,
  { color: string; gradient: string; nameBn?: string }
> = {
  // Service marketplace
  'software-development': {
    color: '#6366F1',
    gradient: 'from-indigo-500 to-blue-600',
    nameBn: 'সফটওয়্যার ডেভেলপমেন্ট',
  },
  'web-development': {
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-600',
    nameBn: 'ওয়েব ডেভেলপমেন্ট',
  },
  'app-development': {
    color: '#14B8A6',
    gradient: 'from-teal-400 to-cyan-500',
    nameBn: 'অ্যাপ ডেভেলপমেন্ট',
  },
  'digital-marketing': {
    color: '#EF4444',
    gradient: 'from-red-500 to-orange-500',
    nameBn: 'ডিজিটাল মার্কেটিং',
  },
  'ai-automations': {
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
    nameBn: 'এআই ও অটোমেশন',
  },
  // Product marketplace
  electronics: {
    color: '#0EA5E9',
    gradient: 'from-sky-400 to-blue-600',
    nameBn: 'ইলেকট্রনিক্স',
  },
  gadgets: {
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
    nameBn: 'গ্যাজেট',
  },
  'office-solutions': {
    color: '#64748B',
    gradient: 'from-slate-500 to-slate-700',
    nameBn: 'অফিস সলিউশন',
  },
  'smart-devices': {
    color: '#10B981',
    gradient: 'from-emerald-400 to-teal-500',
    nameBn: 'স্মার্ট ডিভাইস',
  },
  'digital-products': {
    color: '#F59E0B',
    gradient: 'from-amber-400 to-orange-500',
    nameBn: 'ডিজিটাল পণ্য',
  },
};

const KNOWN_KEYS = new Set([
  ...MAIN_CATEGORY_SLUGS,
  ...MAIN_PRODUCT_CATEGORY_SLUGS,
]);

export function getCategoryStyle(key: string) {
  return (
    CATEGORY_STYLES[key] ?? {
      color: '#6366F1',
      gradient: 'from-indigo-500 to-blue-500',
      nameBn: '',
    }
  );
}

export function isHomeCategoryType(key: string): key is CategoryType {
  return KNOWN_KEYS.has(key) || key in CATEGORY_STYLES;
}
