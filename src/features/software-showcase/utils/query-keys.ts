import type { SoftwareSortId } from '@/src/features/catalog/components/explore/types';
import type { SoftwareMoreFilterId } from '../config/constants';

export const SOFTWARE_LISTING_KEY = 'softwareCollection' as const;

export type SoftwareListingQueryFilters = {
  q: string;
  category: string;
  child: string;
  more: SoftwareMoreFilterId[];
  page: number;
  pageSize: number;
  industrySlug: string;
  price: string;
  size: string;
  sort: SoftwareSortId;
};

export function softwareListingQueryKey(filters: SoftwareListingQueryFilters) {
  return [
    SOFTWARE_LISTING_KEY,
    {
      q: filters.q || '',
      category: filters.category || 'all',
      child: filters.child || 'all',
      more: filters.more.slice().sort().join(','),
      page: filters.page,
      pageSize: filters.pageSize,
      industrySlug: filters.industrySlug || '',
      price: filters.price || '',
      size: filters.size || '',
      sort: filters.sort || 'popular',
    },
  ] as const;
}
