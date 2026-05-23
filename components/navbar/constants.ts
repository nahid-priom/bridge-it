import { ROUTES, marketplaceCategorySearchUrl, marketplaceProductCategoryUrl } from '@/lib/routes';
import {
  MAIN_MARKETPLACE_CATEGORIES,
  MAIN_CATEGORY_EMOJI as SERVICE_CATEGORY_EMOJI,
} from '@/constants/mainMarketplaceCategories';
import {
  MAIN_PRODUCT_CATEGORIES,
  MAIN_PRODUCT_CATEGORY_EMOJI,
} from '@/constants/mainProductCategories';
import { NAV_HOW_IT_WORKS_HREF } from '@/data/homeContent';

/** Service marketplace — freelancers & digital services → /search */
export const NAV_SERVICE_ITEMS = MAIN_MARKETPLACE_CATEGORIES.map((cat) => ({
  slug: cat.slug,
  label: cat.name,
  short: cat.short,
  icon: SERVICE_CATEGORY_EMOJI[cat.slug] ?? '💻',
}));

/** Product marketplace — ecommerce goods → /products */
export const NAV_PRODUCT_ITEMS = MAIN_PRODUCT_CATEGORIES.map((cat) => ({
  slug: cat.slug,
  label: cat.name,
  short: cat.short,
  icon: MAIN_PRODUCT_CATEGORY_EMOJI[cat.slug] ?? '📦',
  productCount: cat.productCount,
}));

export const MAIN_NAV_LINKS = [
  { label: 'Explore', href: marketplaceCategorySearchUrl('web-development') },
  { label: 'How It Works', href: NAV_HOW_IT_WORKS_HREF },
] as const;

export const DRAWER_ACCOUNT_LINKS = [
  { label: 'Log in', href: ROUTES.login, auth: 'guest' as const },
  { label: 'Join Now', href: ROUTES.signup, auth: 'guest' as const, highlight: true },
  { label: 'Dashboard', href: ROUTES.dashboard, auth: 'logged-in' as const },
  { label: 'Messages', href: ROUTES.messages, auth: 'logged-in' as const, badgeKey: 'messages' as const },
  { label: 'Orders', href: ROUTES.dashboard, auth: 'logged-in' as const },
  { label: 'Wishlist', href: ROUTES.products, auth: 'logged-in' as const },
] as const;

export function serviceCategoryHref(slug: string): string {
  return marketplaceCategorySearchUrl(slug);
}

export function productCategoryHref(slug: string): string {
  return marketplaceProductCategoryUrl(slug);
}

export const NAVBAR_SHELL_CLASS =
  'bg-white/90 dark:bg-deshi-navy/95 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 shadow-[0_4px_24px_rgba(15,14,23,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]';
