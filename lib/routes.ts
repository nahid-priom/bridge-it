export const ROUTES = {
  home: '/',
  categories: '/categories',
  category: (slug: string) => `/categories/${slug}`,
  products: '/products',
  product: (slug: string) => `/products/${slug}`,
  about: '/about',
  search: '/search',
  dashboard: '/dashboard',
  admin: '/admin',
  cart: '/cart',
  messages: '/messages',
  service: (slug: string) => `/services/${slug}`,
  seller: (slug: string) => `/sellers/${slug}`,
} as const;

export function searchUrl(query?: string): string {
  if (!query?.trim()) return ROUTES.search;
  return `${ROUTES.search}?q=${encodeURIComponent(query.trim())}`;
}

/** Products listing with optional marketplace category filter */
export function productsUrl(category?: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (category?.trim()) params.set('category', category.trim());
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${ROUTES.products}?${qs}` : ROUTES.products;
}

/** Map legacy page keys to paths for hero CTAs etc. */
export function pathFromPageKey(
  page: 'home' | 'categories' | 'products' | 'about' | 'dashboard' | 'search'
): string {
  const map: Record<string, string> = {
    home: ROUTES.home,
    categories: ROUTES.categories,
    products: ROUTES.products,
    about: ROUTES.about,
    dashboard: ROUTES.dashboard,
    search: ROUTES.search,
  };
  return map[page] ?? ROUTES.home;
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
