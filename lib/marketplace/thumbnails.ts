import type { MarketplaceRowGroup } from '@/types/marketplace';

export type ThumbnailStyle = {
  className: string;
  icon: string;
};

const CATEGORY_STYLES: Record<string, ThumbnailStyle> = {
  'software-development': {
    className:
      'bg-gradient-to-br from-violet-500/90 via-indigo-600/90 to-purple-700/90 dark:from-violet-600/80 dark:via-indigo-700/80 dark:to-purple-900/90',
    icon: '💻',
  },
  'web-development': {
    className:
      'bg-gradient-to-br from-emerald-400/90 via-teal-500/90 to-cyan-600/90 dark:from-emerald-600/70 dark:via-teal-700/80 dark:to-cyan-900/90',
    icon: '🌐',
  },
  'app-development': {
    className:
      'bg-gradient-to-br from-sky-400/90 via-blue-500/90 to-indigo-600/90 dark:from-sky-600/70 dark:via-blue-700/80 dark:to-indigo-900/90',
    icon: '📱',
  },
  'digital-marketing': {
    className:
      'bg-gradient-to-br from-amber-400/90 via-orange-500/90 to-rose-500/90 dark:from-amber-600/70 dark:via-orange-700/80 dark:to-rose-900/90',
    icon: '📣',
  },
  'ai-automations': {
    className:
      'bg-gradient-to-br from-fuchsia-400/90 via-purple-500/90 to-violet-600/90 dark:from-fuchsia-600/70 dark:via-purple-700/80 dark:to-violet-900/90',
    icon: '🤖',
  },
};

const ROW_FALLBACK: Record<MarketplaceRowGroup, ThumbnailStyle> = {
  software_development: CATEGORY_STYLES['software-development'],
  web_development: CATEGORY_STYLES['web-development'],
  app_development: CATEGORY_STYLES['app-development'],
  popular: {
    className:
      'bg-gradient-to-br from-deshi-green/80 via-emerald-500/90 to-teal-600/90 dark:from-emerald-700/70 dark:via-teal-800/80 dark:to-emerald-950/90',
    icon: '⭐',
  },
};

export function getMarketplaceThumbnailStyle(
  categorySlug: string,
  rowGroup: MarketplaceRowGroup
): ThumbnailStyle {
  return CATEGORY_STYLES[categorySlug] ?? ROW_FALLBACK[rowGroup];
}
