/**
 * Listing/search SEO helpers — keep base showrooms indexable;
 * filtered and paginated query URLs should not create duplicate index entries.
 */

export function listingHasSeoFilters(params: {
  q?: string | null;
  page?: string | number | null;
  /** Any non-default filter values */
  filters?: Array<string | null | undefined>;
}): boolean {
  const q = params.q?.trim();
  if (q) return true;

  const pageNum = Number(params.page ?? 1);
  if (Number.isFinite(pageNum) && pageNum > 1) return true;

  for (const value of params.filters ?? []) {
    if (!value) continue;
    const normalized = String(value).trim().toLowerCase();
    if (!normalized || normalized === 'all') continue;
    return true;
  }
  return false;
}
