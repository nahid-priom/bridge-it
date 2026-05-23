import type { CategoryType } from '@/types';

/** Visual styling for category cards (not stored in DB). */
export const CATEGORY_STYLES: Record<
  string,
  { color: string; gradient: string; nameBn?: string }
> = {
  '2d-animation': {
    color: '#FF6B6B',
    gradient: 'from-red-500 to-pink-500',
    nameBn: '২ডি এনিমেশন',
  },
  '3d-animation': {
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-600',
    nameBn: '৩ডি এনিমেশন',
  },
  'video-ads': {
    color: '#06D6A0',
    gradient: 'from-emerald-400 to-teal-500',
    nameBn: 'ভিডিও বিজ্ঞাপন',
  },
  'video-advertising': {
    color: '#06D6A0',
    gradient: 'from-emerald-400 to-teal-500',
    nameBn: 'ভিডিও বিজ্ঞাপন',
  },
  software: {
    color: '#06B6D4',
    gradient: 'from-cyan-400 to-blue-500',
    nameBn: 'সফটওয়্যার কোম্পানি',
  },
  'software-company': {
    color: '#06B6D4',
    gradient: 'from-cyan-400 to-blue-500',
    nameBn: 'সফটওয়্যার কোম্পানি',
  },
  'digital-products': {
    color: '#F59E0B',
    gradient: 'from-amber-400 to-orange-500',
    nameBn: 'ডিজিটাল পণ্য',
  },
  courses: {
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    nameBn: 'অনলাইন কোর্স',
  },
  'online-courses': {
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    nameBn: 'অনলাইন কোর্স',
  },
  'boosting-agency': {
    color: '#10B981',
    gradient: 'from-green-400 to-emerald-500',
    nameBn: 'বুস্টিং এজেন্সি',
  },
  editing: {
    color: '#F97316',
    gradient: 'from-orange-400 to-red-500',
    nameBn: 'এডিটিং সার্ভিস',
  },
  'editing-services': {
    color: '#F97316',
    gradient: 'from-orange-400 to-red-500',
    nameBn: 'এডিটিং সার্ভিস',
  },
  'web-development': {
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-600',
    nameBn: 'ওয়েব ডেভেলপমেন্ট',
  },
  'mobile-apps': {
    color: '#14B8A6',
    gradient: 'from-teal-400 to-cyan-500',
    nameBn: 'মোবাইল অ্যাপ',
  },
  'ui-ux-design': {
    color: '#A855F7',
    gradient: 'from-purple-500 to-pink-500',
    nameBn: 'ইউআই/ইউএক্স ডিজাইন',
  },
  'digital-marketing': {
    color: '#EF4444',
    gradient: 'from-red-500 to-orange-500',
    nameBn: 'ডিজিটাল মার্কেটিং',
  },
};

export function getCategoryStyle(key: string) {
  return (
    CATEGORY_STYLES[key] ?? {
      color: '#6366F1',
      gradient: 'from-indigo-500 to-purple-500',
      nameBn: '',
    }
  );
}

export function isHomeCategoryType(key: string): key is CategoryType {
  return key in CATEGORY_STYLES || key.length > 0;
}
