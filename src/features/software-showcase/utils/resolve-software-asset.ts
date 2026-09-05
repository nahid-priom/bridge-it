import type { SoftwareProject, SoftwareProjectScreen } from '../types';

export type SoftwareAssetKind = 'card' | 'detail' | 'thumb' | 'preview' | 'mobile';

export type ResolvedSoftwareAsset = {
  url: string;
  kind: SoftwareAssetKind;
  width: number;
  height: number;
  assetVersion: number;
};

const DIMENSIONS: Record<SoftwareAssetKind, { width: number; height: number }> = {
  card: { width: 800, height: 600 },
  /** Match card / cover art at 4:3 so detail and listing crop identically */
  detail: { width: 1200, height: 900 },
  thumb: { width: 480, height: 300 },
  preview: { width: 960, height: 600 },
  mobile: { width: 420, height: 860 },
};

/**
 * Single canonical resolver for Software showcase images.
 * Never falls back to legacy SVG / showroom / unrelated pillars.
 */
export function resolveSoftwareCover(
  project: Pick<SoftwareProject, 'cover_card_url' | 'cover_detail_url'> & {
    asset_version?: number | null;
  },
  kind: 'card' | 'detail'
): ResolvedSoftwareAsset | null {
  const version = Math.max(1, Number(project.asset_version ?? 1));
  if (kind === 'card') {
    const url = project.cover_card_url?.trim() || null;
    if (!url || isLegacySoftwareUrl(url)) return null;
    return { url, kind: 'card', ...DIMENSIONS.card, assetVersion: version };
  }
  const url = project.cover_detail_url?.trim() || project.cover_card_url?.trim() || null;
  if (!url || isLegacySoftwareUrl(url)) return null;
  return {
    url,
    kind: project.cover_detail_url ? 'detail' : 'card',
    ...DIMENSIONS[project.cover_detail_url ? 'detail' : 'card'],
    assetVersion: version,
  };
}

export function resolveSoftwareScreen(
  screen: Pick<
    SoftwareProjectScreen,
    'image_url' | 'thumbnail_url' | 'mobile_image_url'
  >,
  kind: 'preview' | 'thumb' | 'mobile',
  assetVersion = 1
): ResolvedSoftwareAsset | null {
  const version = Math.max(1, assetVersion);
  if (kind === 'mobile') {
    const url = screen.mobile_image_url?.trim() || null;
    if (!url || isLegacySoftwareUrl(url)) return null;
    return { url, kind: 'mobile', ...DIMENSIONS.mobile, assetVersion: version };
  }
  if (kind === 'thumb') {
    const url = screen.thumbnail_url?.trim() || null;
    if (!url || isLegacySoftwareUrl(url)) return null;
    return { url, kind: 'thumb', ...DIMENSIONS.thumb, assetVersion: version };
  }
  const url = screen.image_url?.trim() || null;
  if (!url || isLegacySoftwareUrl(url)) return null;
  return { url, kind: 'preview', ...DIMENSIONS.preview, assetVersion: version };
}

/** Detect known legacy Software showcase / BITP showroom paths. */
export function isLegacySoftwareUrl(url: string): boolean {
  const u = url.toLowerCase();
  if (u.includes('/showroom/covers/software-')) return true;
  if (u.endsWith('.svg') && u.includes('software-')) return true;
  // Flat legacy seed filenames without versioned software-showcase prefix are OK if already in Storage —
  // only reject explicit BITP showroom and placeholder patterns.
  if (u.includes('placeholder') || u.includes('dashboard-fallback')) return true;
  return false;
}

export function withCacheBust(url: string, assetVersion: number): string {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    // Prefer path-versioned URLs; only add v= when path lacks /vN/
    if (!/\/v\d+\//.test(parsed.pathname)) {
      parsed.searchParams.set('v', String(Math.max(1, assetVersion)));
    }
    return parsed.toString();
  } catch {
    if (/[?&]v=\d+/.test(url) || /\/v\d+\//.test(url)) return url;
    return `${url}${url.includes('?') ? '&' : '?'}v=${Math.max(1, assetVersion)}`;
  }
}
