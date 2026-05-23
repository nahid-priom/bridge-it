import { ROUTES, productsUrl } from '@/lib/routes';
import { productCategories } from '@/archive/demo-data/productCategories';

export const NAV_CATEGORY_ITEMS = productCategories.filter((c) => c.key !== 'all');

export const MAIN_NAV_LINKS = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Products', href: ROUTES.products },
  { label: 'Services', href: ROUTES.search },
  { label: 'About', href: ROUTES.about },
] as const;

export const DRAWER_ACCOUNT_LINKS = [
  { label: 'Log in', href: ROUTES.login, auth: 'guest' as const },
  { label: 'Join Now', href: ROUTES.signup, auth: 'guest' as const, highlight: true },
  { label: 'Dashboard', href: ROUTES.dashboard, auth: 'logged-in' as const },
  { label: 'Messages', href: ROUTES.messages, auth: 'logged-in' as const, badgeKey: 'messages' as const },
  { label: 'Orders', href: ROUTES.dashboard, auth: 'logged-in' as const },
  { label: 'Wishlist', href: ROUTES.products, auth: 'logged-in' as const },
] as const;

export function categoryProductsHref(key: string): string {
  return productsUrl(key);
}

/** Shared floating navbar shell */
export const NAVBAR_SHELL_CLASS =
  'bg-white/90 dark:bg-bridge-dark-2/90 backdrop-blur-2xl border border-slate-200/70 dark:border-white/10 shadow-[0_24px_70px_rgba(108,60,225,0.16)]';
