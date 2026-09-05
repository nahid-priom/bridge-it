import type { CreativeMoreFilterId } from '../config/constants';

export const CREATIVE_MARKETING_LISTING_KEY = 'creative-marketing-listing' as const;

export type CreativeMarketingListingQueryFilters = {
  q: string;
  group: string;
  more: CreativeMoreFilterId[];
  page: number;
  pageSize: number;
  industrySlug: string;
};

export function creativeMarketingListingQueryKey(filters: CreativeMarketingListingQueryFilters) {
  return [
    CREATIVE_MARKETING_LISTING_KEY,
    {
      q: filters.q || '',
      group: filters.group || 'all',
      more: filters.more.slice().sort().join(','),
      page: filters.page,
      pageSize: filters.pageSize,
      industrySlug: filters.industrySlug || '',
    },
  ] as const;
}
