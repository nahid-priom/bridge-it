import { allMarketplaceServices } from '@/data/services';
import { allSellers } from '@/data/services';
import type { Service, Seller } from '@/types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** SEO-friendly slug: title slug + service id for uniqueness */
export function getServiceSlug(service: Service): string {
  return `${slugify(service.title)}-${service.id}`;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return allMarketplaceServices.find((s) => getServiceSlug(s) === slug || s.id === slug);
}

export function getAllServiceSlugs(): string[] {
  return allMarketplaceServices.map(getServiceSlug);
}

export function getSellerBySlug(slug: string): Seller | undefined {
  return allSellers.find((s) => s.slug === slug || s.id === slug);
}

export function getAllSellerSlugs(): string[] {
  return allSellers.map((s) => s.slug);
}
