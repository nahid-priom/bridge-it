import { ROUTES } from '@/lib/routes';
import { LISTING_CATEGORIES } from '@/src/features/ecommerce-showcase/config/constants';
import {
  SOFTWARE_MORE_FILTERS,
  SOFTWARE_PRIMARY_FILTERS,
} from '@/src/features/software-showcase/config/constants';
import { CREATIVE_MARKETING_SERVICE_GROUPS } from '@/src/features/creative-marketing-showcase/config/constants';

export type NavCategoryChild = {
  id: string;
  label: string;
  href: string;
};

export type NavCategoryPillarId = 'websites' | 'software' | 'marketing';

export type NavCategoryPillar = {
  id: NavCategoryPillarId;
  label: string;
  href: string;
  children: NavCategoryChild[];
  /** Extra children shown under a “More” divider (software only). */
  moreChildren?: NavCategoryChild[];
};

export function exploreWebsitesHref(categorySlug?: string): string {
  const params = new URLSearchParams();
  params.set('type', 'websites');
  if (categorySlug && categorySlug !== 'all') params.set('category', categorySlug);
  return `${ROUTES.explore}?${params.toString()}`;
}

export function exploreSoftwareHref(options?: {
  group?: string;
  more?: string;
}): string {
  const params = new URLSearchParams();
  params.set('type', 'software');
  if (options?.group && options.group !== 'all') params.set('group', options.group);
  if (options?.more) params.set('more', options.more);
  return `${ROUTES.explore}?${params.toString()}`;
}

export function exploreMarketingHref(serviceGroup?: string): string {
  const params = new URLSearchParams();
  params.set('type', 'marketing');
  if (serviceGroup && serviceGroup !== 'all') params.set('serviceGroup', serviceGroup);
  return `${ROUTES.explore}?${params.toString()}`;
}

const websiteChildren: NavCategoryChild[] = LISTING_CATEGORIES.filter(
  (item): item is (typeof LISTING_CATEGORIES)[number] & { slug: string } =>
    item.id !== 'all' && typeof item.slug === 'string' && item.slug.length > 0
).map((item) => ({
  id: item.slug,
  label: item.label,
  href: exploreWebsitesHref(item.slug),
}));

const softwarePrimaryChildren: NavCategoryChild[] = SOFTWARE_PRIMARY_FILTERS.filter(
  (item) => item.id !== 'all'
).map((item) => ({
  id: item.id,
  label: item.label,
  href: exploreSoftwareHref({ group: item.id }),
}));

const softwareMoreChildren: NavCategoryChild[] = SOFTWARE_MORE_FILTERS.map((item) => ({
  id: item.id,
  label: item.label,
  href: exploreSoftwareHref({ more: item.id }),
}));

const marketingChildren: NavCategoryChild[] = CREATIVE_MARKETING_SERVICE_GROUPS.map((item) => ({
  id: item.slug,
  label: item.name,
  href: exploreMarketingHref(item.slug),
}));

export const NAV_CATEGORY_PILLARS: NavCategoryPillar[] = [
  {
    id: 'websites',
    label: 'Websites',
    href: exploreWebsitesHref(),
    children: websiteChildren,
  },
  {
    id: 'software',
    label: 'Software',
    href: exploreSoftwareHref(),
    children: softwarePrimaryChildren,
    moreChildren: softwareMoreChildren,
  },
  {
    id: 'marketing',
    label: 'Creative & Marketing',
    href: exploreMarketingHref(),
    children: marketingChildren,
  },
];

export function isCategoryNavPath(pathname: string): boolean {
  return (
    pathname === ROUTES.explore ||
    pathname.startsWith(`${ROUTES.explore}/`) ||
    pathname === ROUTES.websites ||
    pathname.startsWith(`${ROUTES.websites}/`) ||
    pathname === ROUTES.softwareShowroom ||
    pathname.startsWith(`${ROUTES.softwareShowroom}/`) ||
    pathname === ROUTES.creativeMarketingShowroom ||
    pathname.startsWith(`${ROUTES.creativeMarketingShowroom}/`)
  );
}
