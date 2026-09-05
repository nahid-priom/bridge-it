import type { SoftwareProductFeature } from '../types';
import { inferIconKeyFromTitle, inferShortDescription } from './feature-icons';

export type DisplayFeature = {
  id: string;
  title: string;
  shortDescription: string;
  iconKey: string;
};

function toDisplay(feature: SoftwareProductFeature): DisplayFeature {
  return {
    id: feature.id,
    title: feature.title,
    shortDescription:
      feature.short_description?.trim() || inferShortDescription(feature.title),
    iconKey: feature.icon_key?.trim() || inferIconKeyFromTitle(feature.title),
  };
}

/**
 * Primary (important) features first by sort_order, then remaining published.
 * Initial grid shows up to 4; rest go in expandable section.
 */
export function splitImportantFeatures(features: SoftwareProductFeature[]): {
  initial: DisplayFeature[];
  rest: DisplayFeature[];
} {
  const published = features
    .filter((f) => f.published && !f.deleted_at)
    .slice()
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return a.sort_order - b.sort_order;
    });

  const primary = published.filter((f) => f.is_primary);
  const ordered = primary.length > 0 ? [...primary, ...published.filter((f) => !f.is_primary)] : published;
  const display = ordered.map(toDisplay);
  return {
    initial: display.slice(0, 4),
    rest: display.slice(4),
  };
}
