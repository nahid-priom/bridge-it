import { ROUTES } from '@/lib/routes';
import { LISTING_CATEGORIES } from '@/src/features/ecommerce-showcase/config/constants';
import { CREATIVE_MARKETING_SERVICE_GROUPS } from '@/src/features/creative-marketing-showcase/config/constants';
import {
  SOFTWARE_HUB_PRIORITY_SLUGS,
  SOFTWARE_INDUSTRIES_45,
  SOFTWARE_INDUSTRY_LABELS,
  type SoftwareIndustry45Slug,
} from '@/src/features/catalog/config/software-industries-45';

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
  /** Extra children shown under a “More” divider. */
  moreChildren?: NavCategoryChild[];
};

export function exploreWebsitesHref(categorySlug?: string): string {
  if (categorySlug && categorySlug !== 'all') {
    return ROUTES.websiteIndustry(categorySlug);
  }
  return ROUTES.websites;
}

export function exploreSoftwareHref(options?: {
  group?: string;
  more?: string;
  industry?: string;
}): string {
  if (options?.industry) return ROUTES.softwareIndustry(options.industry);
  return ROUTES.softwareShowroom;
}

export function exploreMarketingHref(serviceGroup?: string): string {
  if (serviceGroup && serviceGroup !== 'all') {
    return ROUTES.marketingIndustry(serviceGroup);
  }
  return ROUTES.marketingShowroom;
}

const websiteChildren: NavCategoryChild[] = LISTING_CATEGORIES.filter(
  (item): item is (typeof LISTING_CATEGORIES)[number] & { slug: string } =>
    item.id !== 'all' && typeof item.slug === 'string' && item.slug.length > 0
).map((item) => ({
  id: item.slug,
  label: item.label,
  href: exploreWebsitesHref(item.slug),
}));

const prioritySet = new Set<string>(SOFTWARE_HUB_PRIORITY_SLUGS);

const softwarePrimaryChildren: NavCategoryChild[] = SOFTWARE_HUB_PRIORITY_SLUGS.map((slug) => ({
  id: slug,
  label: SOFTWARE_INDUSTRY_LABELS[slug],
  href: ROUTES.softwareIndustry(slug),
}));

const softwareMoreChildren: NavCategoryChild[] = SOFTWARE_INDUSTRIES_45.filter(
  (slug) => !prioritySet.has(slug)
).map((slug: SoftwareIndustry45Slug) => ({
  id: slug,
  label: SOFTWARE_INDUSTRY_LABELS[slug],
  href: ROUTES.softwareIndustry(slug),
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
    href: ROUTES.websites,
    children: websiteChildren,
  },
  {
    id: 'software',
    label: 'Software',
    href: ROUTES.softwareShowroom,
    children: softwarePrimaryChildren,
    moreChildren: softwareMoreChildren,
  },
  {
    id: 'marketing',
    label: 'Creative & Marketing',
    href: ROUTES.marketingShowroom,
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
    pathname.startsWith(`${ROUTES.creativeMarketingShowroom}/`) ||
    pathname === ROUTES.marketingShowroom ||
    pathname.startsWith(`${ROUTES.marketingShowroom}/`)
  );
}
