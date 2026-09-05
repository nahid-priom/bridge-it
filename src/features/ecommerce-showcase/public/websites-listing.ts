import { LISTING_CATEGORIES, LISTING_VIEW_TABS } from '../config/constants';
import { parseFilterList } from '../utils/filters';

export const LISTING_LIMIT = 24;

export const WEBSITES_PAGE_TITLE = 'E-commerce Website Templates';

export const WEBSITES_PAGE_DESCRIPTION =
  'Browse premium website templates for fashion, electronics, food, beauty and more.';

export function websitesListingCopy(filters: { view?: string; category?: string; q?: string }) {
  const viewLabels = parseFilterList(filters.view)
    .map((id) => LISTING_VIEW_TABS.find((tab) => tab.id === id)?.label)
    .filter((label) => Boolean(label)) as string[];
  const categoryLabels = parseFilterList(filters.category)
    .map((id) => LISTING_CATEGORIES.find((item) => item.slug === id || item.id === id)?.label)
    .filter((label) => Boolean(label)) as string[];

  const viewLabel = viewLabels.join(', ') || undefined;
  const categoryLabel = categoryLabels.join(', ') || undefined;

  const titleParts = [categoryLabel, viewLabel].filter(Boolean);
  const title = titleParts.length
    ? `${titleParts.join(' ')} E-commerce Website Templates`
    : WEBSITES_PAGE_TITLE;

  let description = WEBSITES_PAGE_DESCRIPTION;
  if (filters.q) {
    description = `Search results for “${filters.q}”. ${WEBSITES_PAGE_DESCRIPTION}`;
  } else if (categoryLabel || viewLabel) {
    const scope = [categoryLabel, viewLabel ? `${viewLabel.toLowerCase()} pages` : null]
      .filter(Boolean)
      .join(', ');
    description = `Browse ${scope} among premium e-commerce website templates in Bangladesh.`;
  }

  return { title, description };
}
