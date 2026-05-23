export type MarketplaceSortOption =
  | 'recommended'
  | 'top-rated'
  | 'price-low'
  | 'price-high'
  | 'fast-delivery';

export type MarketplaceBudgetFilter = 'all' | 'under-15k' | '15k-50k' | '50k-150k' | '150k-plus';

export type MarketplaceDeliveryFilter = 'all' | '1-7' | '8-21' | '22-plus';

export type MarketplaceRatingFilter = 'all' | '4.5' | '4.7' | '4.9';

export type MarketplaceSearchParams = {
  q: string;
  category: string;
  sort: MarketplaceSortOption;
  budget: MarketplaceBudgetFilter;
  delivery: MarketplaceDeliveryFilter;
  rating: MarketplaceRatingFilter;
  page: number;
};

export type ActiveFilterChip = {
  id: string;
  label: string;
};
