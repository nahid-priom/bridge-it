const LEGACY_SVG_PREFIX = '/showroom/covers/';
const SOLUTION_COVERS_BUCKET = 'solution-covers';

/** Returns true when the URL is missing or still a local SVG / non-storage placeholder. */
export function isLegacyCover(url: string | null | undefined, path?: string | null): boolean {
  if (path?.includes(SOLUTION_COVERS_BUCKET)) return false;
  if (!url?.trim()) return true;
  if (url.startsWith(LEGACY_SVG_PREFIX)) return true;
  if (url.endsWith('.svg')) return true;
  if (url.includes(`/storage/v1/object/public/${SOLUTION_COVERS_BUCKET}/`)) return false;
  return !url.startsWith('http');
}

export function hasValidSolutionCover(
  url: string | null | undefined,
  path?: string | null
): boolean {
  return !isLegacyCover(url, path);
}

export const SOLUTION_COVERS_BUCKET_NAME = SOLUTION_COVERS_BUCKET;
