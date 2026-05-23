import { ROUTES } from '@/lib/routes';
import { NAV_HOW_IT_WORKS_HREF } from '@/data/homeContent';

export const EXPLORE_MOBILE_LINKS = [
  { label: 'Top Freelancers', href: ROUTES.search },
  { label: 'Popular Services', href: ROUTES.search },
  { label: 'Popular Products', href: ROUTES.products },
  { label: 'Success Stories', href: ROUTES.about },
  { label: 'Community', href: ROUTES.about },
  { label: 'Blog', href: ROUTES.about },
  { label: 'Help Center', href: NAV_HOW_IT_WORKS_HREF },
] as const;
