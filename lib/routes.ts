export const ROUTES = {
  home: '/',
  websites: '/websites',
  website: (slug: string) => `/websites/${slug}`,
  ecommerceCategory: (slug: string) => `/ecommerce/${slug}`,
  solutions: '/websites',
  solution: (slug: string) => `/websites/${slug}`,
  solutionOrder: (slug: string) => `/consultation`,
  solutionQuote: (slug: string) => `/consultation`,
  pricing: '/pricing',
  portfolio: '/portfolio',
  about: '/about',
  consultation: '/consultation',
  ecommerceShowroom: '/websites',
  ecommerceSolution: (slug: string) => `/websites/${slug}`,
  ecommerceSolutionOrder: (slug: string) => `/consultation`,
  ecommerceDemo: (demoSlug: string) => `/demo/ecommerce/${demoSlug}`,
  softwareShowroom: '/websites',
  softwareSolution: (slug: string) => `/websites/${slug}`,
  softwareSolutionOrder: (slug: string) => `/consultation`,
  softwareDemo: (demoSlug: string) => `/demo/software/${demoSlug}`,
  search: '/websites',
  /** @deprecated Use solutions */
  categories: '/categories',
  category: (slug: string) => `/categories/${slug}`,
  /** @deprecated Use solutions */
  products: '/products',
  product: (slug: string) => `/products/${slug}`,
  dashboard: '/dashboard',
  clientOrders: '/dashboard/orders',
  clientOrder: (id: string) => `/dashboard/orders/${id}`,
  clientProjects: '/dashboard/projects',
  clientProject: (id: string) => `/dashboard/projects/${id}`,
  clientMessages: '/dashboard/messages',
  clientPayments: '/dashboard/payments',
  clientQuotations: '/dashboard/quotations',
  clientFiles: '/dashboard/files',
  clientProfile: '/dashboard/profile',
  clientSettings: '/dashboard/settings',
  clientSupport: '/dashboard/support',
  /** @deprecated */
  clientWallet: '/dashboard/wallet',
  /** @deprecated */
  clientInvoices: '/dashboard/invoices',
  /** @deprecated */
  clientProducts: '/dashboard/products',
  /** @deprecated */
  clientServices: '/dashboard/services',
  login: '/login',
  signup: '/signup',
  admin: '/admin',
  adminEcommerceProjects: '/admin/ecommerce-projects',
  adminEcommerceLeads: '/admin/ecommerce-leads',
  /** @deprecated Seller hub removed — redirects via middleware */
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
  sellerOnboarding: '/seller/onboarding',
  legacySellerDashboard: '/dashboard/seller',
  /** @deprecated */
  seller: (slug: string) => `/sellers/${slug}`,
  marketplaceSeller: (slug: string) => `/seller/${slug}`,
  /** @deprecated Redirect to solutions */
  cart: '/cart',
  messages: '/messages',
  /** @deprecated Use solutions */
  service: (slug: string) => `/services/${slug}`,
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
  return qs ? `${ROUTES.solutions}?${qs}` : ROUTES.solutions;
}

export function solutionsUrl(category?: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (category?.trim()) params.set('category', category.trim());
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${ROUTES.solutions}?${qs}` : ROUTES.solutions;
}

export function solutionsSearchUrl(query?: string): string {
  const trimmed = query?.trim();
  if (!trimmed) return ROUTES.solutions;
  return solutionsUrl(undefined, { q: trimmed });
}

/** @deprecated Use solutionsUrl */
export function marketplaceCategorySearchUrl(slug: string): string {
  return solutionsUrl(slug);
}

/** @deprecated Use solutionsUrl */
export function marketplaceProductCategoryUrl(slug: string): string {
  return solutionsUrl(slug);
}

/** @deprecated Use solutionsUrl */
export function productsUrl(category?: string, extra?: Record<string, string>): string {
  return solutionsUrl(category, extra);
}

/** @deprecated Use solutionsSearchUrl */
export function productsSearchUrl(query?: string): string {
  return solutionsSearchUrl(query);
}

export function pathFromPageKey(
  page: 'home' | 'categories' | 'products' | 'about' | 'dashboard' | 'search' | 'solutions' | 'pricing' | 'portfolio'
): string {
  const map: Record<string, string> = {
    home: ROUTES.home,
    categories: ROUTES.solutions,
    products: ROUTES.solutions,
    solutions: ROUTES.solutions,
    pricing: ROUTES.pricing,
    portfolio: ROUTES.portfolio,
    about: ROUTES.about,
    dashboard: ROUTES.dashboard,
    search: ROUTES.solutions,
  };
  return map[page] ?? ROUTES.home;
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
