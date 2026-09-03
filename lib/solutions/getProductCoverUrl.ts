import { hasValidSolutionCover } from '@/lib/solutions/isLegacyCover';

type ProductCoverFields = {
  cover_image?: string | null;
  thumbnail?: string | null;
  cover_image_path?: string | null;
  cover_image_alt?: string | null;
};

/** Preferred display URL for solution cards (cover first, skip legacy SVGs). */
export function getProductCoverUrl(product: ProductCoverFields): string | null {
  if (hasValidSolutionCover(product.cover_image, product.cover_image_path)) {
    return product.cover_image ?? null;
  }
  if (hasValidSolutionCover(product.thumbnail, product.cover_image_path)) {
    return product.thumbnail ?? null;
  }
  return null;
}

export function getProductCoverAlt(
  product: ProductCoverFields & { name?: string; category?: { name?: string } | null }
): string {
  if (product.cover_image_alt?.trim()) return product.cover_image_alt;
  const category = product.category?.name;
  return category
    ? `${product.name ?? 'Product'} — ${category} cover image`
    : `${product.name ?? 'Product'} cover image`;
}
