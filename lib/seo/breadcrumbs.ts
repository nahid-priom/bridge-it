import { SITE_URL } from '@/lib/site';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbJsonLdItem = {
  name: string;
  url: string;
};

/** Static segment → label for auto-generated trails */
export const BREADCRUMB_SEGMENT_LABELS: Record<string, string> = {
  websites: 'Websites',
  ecommerce: 'E-commerce',
  pricing: 'Pricing',
  portfolio: 'Portfolio',
  consultation: 'Consultation',
  categories: 'Categories',
  products: 'Products',
  services: 'Services',
  sellers: 'Sellers',
  about: 'About',
  search: 'Search',
  dashboard: 'Dashboard',
  admin: 'Admin',
  cart: 'Cart',
  messages: 'Messages',
};

/** Parent href for segments that are not literal path folders */
const SEGMENT_PARENT_HREF: Record<string, string> = {
  sellers: '/search',
};

const SKIP_BREADCRUMB_PATHS = new Set(['/']);

export function slugToBreadcrumbLabel(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function shouldShowBreadcrumb(pathname: string): boolean {
  const path = normalizePath(pathname);
  return !SKIP_BREADCRUMB_PATHS.has(path);
}

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const withoutQuery = pathname.split('?')[0] ?? pathname;
  return withoutQuery.endsWith('/') && withoutQuery.length > 1
    ? withoutQuery.slice(0, -1)
    : withoutQuery;
}

/**
 * Build UI breadcrumb items from a pathname (Home is always first).
 */
export function buildBreadcrumbsFromPathname(
  pathname: string,
  overrides?: Partial<Record<number, string>>
): BreadcrumbItem[] {
  const path = normalizePath(pathname);
  if (path === '/') return [];

  const segments = path.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  let accumulated = '';
  segments.forEach((segment, index) => {
    accumulated += `/${segment}`;
    const isLast = index === segments.length - 1;
    const overrideLabel = overrides?.[index + 1];
    const label =
      overrideLabel ??
      BREADCRUMB_SEGMENT_LABELS[segment] ??
      slugToBreadcrumbLabel(segment);

    const href = isLast ? accumulated : SEGMENT_PARENT_HREF[segment] ?? accumulated;
    items.push({ label, href });
  });

  return items;
}

/** Convert UI items to absolute URLs for JSON-LD (last item may include href for schema) */
export function breadcrumbItemsToJsonLd(
  items: BreadcrumbItem[],
  siteUrl: string = SITE_URL
): BreadcrumbJsonLdItem[] {
  const base = siteUrl.replace(/\/$/, '');

  return items.map((item) => {
    const path = item.href ?? '/';
    const url = path.startsWith('http')
      ? path
      : `${base}${path === '/' ? '' : path}`;
    return { name: item.label, url };
  });
}
