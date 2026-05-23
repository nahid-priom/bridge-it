export const ROUTES = {
  home: '/',
  categories: '/categories',
  category: (slug: string) => `/categories/${slug}`,
  products: '/products',
  product: (slug: string) => `/products/${slug}`,
  about: '/about',
  search: '/search',
  dashboard: '/dashboard',
  clientOrders: '/dashboard/orders',
  clientProjects: '/dashboard/projects',
  clientProject: (id: string) => `/dashboard/projects/${id}`,
  clientMessages: '/dashboard/messages',
  clientPayments: '/dashboard/payments',
  clientWallet: '/dashboard/wallet',
  clientInvoices: '/dashboard/invoices',
  clientProducts: '/dashboard/products',
  clientServices: '/dashboard/services',
  clientSettings: '/dashboard/settings',
  clientSupport: '/dashboard/support',
  sellerDashboard: '/seller-dashboard',
  sellerDashboardOrders: '/seller-dashboard/orders',
  sellerDashboardServices: '/seller-dashboard/services',
  sellerDashboardProducts: '/seller-dashboard/products',
  sellerDashboardEarnings: '/seller-dashboard/earnings',
  sellerDashboardMessages: '/seller-dashboard/messages',
  sellerDashboardAnalytics: '/seller-dashboard/analytics',
  sellerDashboardReviews: '/seller-dashboard/reviews',
  sellerDashboardClients: '/seller-dashboard/clients',
  sellerDashboardWallet: '/seller-dashboard/wallet',
  sellerDashboardPayouts: '/seller-dashboard/payouts',
  sellerDashboardProfile: '/seller-dashboard/profile',
  sellerDashboardSettings: '/seller-dashboard/settings',
  sellerDashboardSettingsVerification: '/seller-dashboard/settings/verification',
  sellerDashboardSettingsNotifications: '/seller-dashboard/settings/notifications',
  sellerDashboardSettingsSecurity: '/seller-dashboard/settings/security',
  sellerDashboardOnboarding: '/seller-dashboard/onboarding',
  sellerDashboardServicesNew: '/seller-dashboard/services/new',
  sellerDashboardProductsNew: '/seller-dashboard/products/new',
  /** @deprecated Use sellerDashboard */
  legacySellerDashboard: '/dashboard/seller',
  /** @deprecated Use sellerDashboardOnboarding */
  sellerOnboarding: '/seller/onboarding',
  login: '/login',
  signup: '/signup',
  admin: '/admin',
  cart: '/cart',
  messages: '/messages',
  service: (slug: string) => `/services/${slug}`,
  /** Legacy sellers route — prefer marketplaceSeller */
  seller: (slug: string) => `/sellers/${slug}`,
  marketplaceSeller: (slug: string) => `/seller/${slug}`,
} as const;

export function searchUrl(query?: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  const trimmed = query?.trim();
  if (trimmed) params.set('q', trimmed);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${ROUTES.search}?${qs}` : ROUTES.search;
}

/** Marketplace category filter on search */
export function marketplaceCategorySearchUrl(slug: string): string {
  return `${ROUTES.search}?category=${encodeURIComponent(slug)}`;
}

/** Product marketplace category on /products */
export function marketplaceProductCategoryUrl(slug: string): string {
  return `${ROUTES.products}?category=${encodeURIComponent(slug)}`;
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

/** Products listing search — URL is the source of truth for navbar search. */
export function productsSearchUrl(query?: string): string {
  const trimmed = query?.trim();
  if (!trimmed) return ROUTES.products;
  return productsUrl(undefined, { q: trimmed });
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
