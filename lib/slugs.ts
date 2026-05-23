import { slugify as baseSlugify } from '@/lib/catalog/slugify';
import type { Service } from '@/types';

export { baseSlugify as slugify };

/** Client-safe slug for service/product links (prefers DB slug when present). */
export function getServiceSlug(service: Pick<Service, 'title' | 'id'> & { slug?: string }): string {
  if (service.slug?.trim()) return service.slug;
  return `${baseSlugify(service.title)}-${service.id}`;
}
