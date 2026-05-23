import type { Service } from '@/types';

export function getSellerSlugFromService(service: Pick<Service, 'sellerSlug' | 'sellerId'>): string | undefined {
  return service.sellerSlug;
}
