import { ROUTES } from '@/lib/routes';
import { NAV_HOW_IT_WORKS_HREF } from '@/data/homeContent';

/** Primary public navigation — one crawlable Link per business pillar. */
export const MAIN_NAV_LINKS = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Websites', href: ROUTES.websites },
  { label: 'Software', href: ROUTES.softwareShowroom },
  { label: 'Creative & Marketing', href: ROUTES.creativeMarketingShowroom },
  { label: 'Portfolio', href: ROUTES.portfolio },
  { label: 'Consultation', href: ROUTES.consultation },
] as const;

export const DRAWER_ACCOUNT_LINKS = [
  { label: 'Log in', href: ROUTES.login, auth: 'guest' as const },
  { label: 'Sign Up', href: ROUTES.signup, auth: 'guest' as const, highlight: true },
  { label: 'Dashboard', href: ROUTES.dashboard, auth: 'logged-in' as const },
  { label: 'Orders', href: ROUTES.clientOrders, auth: 'logged-in' as const },
  { label: 'Projects', href: ROUTES.clientProjects, auth: 'logged-in' as const },
  { label: 'Support', href: ROUTES.clientSupport, auth: 'logged-in' as const },
] as const;

export function solutionCategoryHref(slug: string): string {
  return `${ROUTES.solutions}?category=${encodeURIComponent(slug)}`;
}

/** @deprecated Use solutionCategoryHref */
export function serviceCategoryHref(slug: string): string {
  return solutionCategoryHref(slug);
}

/** @deprecated Use solutionCategoryHref */
export function productCategoryHref(slug: string): string {
  return solutionCategoryHref(slug);
}

export const NAVBAR_SHELL_CLASS =
  'bg-white/90 dark:bg-deshi-navy/95 backdrop-blur-xl border-0 shadow-[0_4px_24px_rgba(15,14,23,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]';

/** @deprecated Use MAIN_NAV_LINKS */
export const NAV_SERVICE_ITEMS: { slug: string; label: string; short: string; icon: string }[] = [];
export const NAV_PRODUCT_ITEMS: { slug: string; label: string; short: string; icon: string; productCount?: number }[] = [];

export { NAV_HOW_IT_WORKS_HREF };
