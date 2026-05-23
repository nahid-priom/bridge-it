import { allSellers } from '@/data/services';

export function getSellerSlugById(sellerId: string): string | undefined {
  return allSellers.find((s) => s.id === sellerId)?.slug;
}
