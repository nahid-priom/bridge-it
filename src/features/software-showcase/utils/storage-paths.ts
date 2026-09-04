import { SOFTWARE_BUCKET } from '../config/constants';

export { SOFTWARE_BUCKET };

/** Canonical storage root inside admin-showcase bucket. */
export const SOFTWARE_SHOWCASE_PREFIX = 'software-showcase';

/** Legacy UUID-based paths — keep helpers for cleanup/migration only. */
export function legacyProjectFolder(projectId: string): string {
  return `projects/${projectId}`;
}

export function projectFolder(projectId: string): string {
  return legacyProjectFolder(projectId);
}

/** Slug + versioned canonical folder. */
export function canonicalProductFolder(slug: string, assetVersion: number): string {
  const v = Math.max(1, Math.floor(assetVersion || 1));
  return `${SOFTWARE_SHOWCASE_PREFIX}/${slug}/v${v}`;
}

export function coverCardPath(slug: string, assetVersion: number): string {
  return `${canonicalProductFolder(slug, assetVersion)}/cover/card.avif`;
}

export function coverDetailPath(slug: string, assetVersion: number): string {
  return `${canonicalProductFolder(slug, assetVersion)}/cover/detail.avif`;
}

export function screenPreviewPath(slug: string, assetVersion: number, screenKey: string): string {
  return `${canonicalProductFolder(slug, assetVersion)}/screens/${screenKey}/preview.avif`;
}

export function screenThumbPath(slug: string, assetVersion: number, screenKey: string): string {
  return `${canonicalProductFolder(slug, assetVersion)}/screens/${screenKey}/thumb.avif`;
}

export function screenMobilePath(slug: string, assetVersion: number, screenKey: string): string {
  return `${canonicalProductFolder(slug, assetVersion)}/screens/${screenKey}/mobile.avif`;
}

export function originalObjectPath(slug: string, assetVersion: number, fileName: string): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
  return `${canonicalProductFolder(slug, assetVersion)}/original/${Date.now()}-${safe}`;
}

/** @deprecated UUID paths — used only by legacy cleanup detection */
export function legacyCoverCardPath(projectId: string): string {
  return `${legacyProjectFolder(projectId)}/cover/card.avif`;
}
export function legacyCoverDetailPath(projectId: string): string {
  return `${legacyProjectFolder(projectId)}/cover/detail.avif`;
}
export function legacyScreenPreviewPath(projectId: string, screenKey: string): string {
  return `${legacyProjectFolder(projectId)}/screens/${screenKey}/preview.avif`;
}
export function legacyScreenThumbPath(projectId: string, screenKey: string): string {
  return `${legacyProjectFolder(projectId)}/screens/${screenKey}/thumb.avif`;
}
