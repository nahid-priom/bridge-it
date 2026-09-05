/**
 * Canonical cover fields for catalog listing cards.
 * Mappers resolve pillar-specific DB columns into these; cards must not read raw cover_* columns.
 */
export type CatalogCoverFields = {
  /** Only URL cards may render as the cover. Null = deliberate empty placeholder. */
  coverImageUrl: string | null;
  /** Websites AVIF/WebP format pair only — not an alternate cover source. */
  coverImageFallbackUrl?: string | null;
  /** Software cache-bust version; applied in mapper via withCacheBust when path lacks /vN/. */
  coverAssetVersion?: number | null;
};

/**
 * Normalize a public asset URL or storage path reference for catalog rendering.
 * - Passes through valid http(s) URLs
 * - Returns null for empty/invalid values
 * - Does not invent bucket prefixes (paths must already be public URLs from Storage)
 */
export function getPublicAssetUrl(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      // Collapse accidental duplicate slashes in pathname (keep protocol //)
      parsed.pathname = parsed.pathname.replace(/\/{2,}/g, '/');
      return parsed.toString();
    } catch {
      return null;
    }
  }
  // Relative paths / data URLs are not used for catalog covers
  return null;
}
