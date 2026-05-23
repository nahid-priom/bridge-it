import 'server-only';

import { listAllServiceSlugs as listServiceSlugs } from '@/lib/catalog/services';
import { listAllSellerSlugs as listSellerSlugs } from '@/lib/catalog/sellers';
import { fetchServiceBySlug } from '@/lib/catalog/services';
import { fetchSellerBySlug } from '@/lib/catalog/sellers';
import type { Service, Seller } from '@/types';

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const service = await fetchServiceBySlug(slug);
  return service ?? undefined;
}

export async function getAllServiceSlugs(): Promise<string[]> {
  return listServiceSlugs();
}

export async function getSellerBySlug(slug: string): Promise<Seller | undefined> {
  const seller = await fetchSellerBySlug(slug);
  return seller ?? undefined;
}

export async function getAllSellerSlugs(): Promise<string[]> {
  return listSellerSlugs();
}
