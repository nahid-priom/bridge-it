import { ROUTES } from '@/lib/routes';
import { NAV_HOW_IT_WORKS_HREF } from '@/data/homeContent';

export const EXPLORE_MOBILE_LINKS = [
  { label: 'Websites', href: ROUTES.websites },
  { label: 'Software Solutions', href: ROUTES.softwareShowroom },
  { label: 'Creative & Digital Marketing', href: ROUTES.creativeMarketingShowroom },
  { label: 'Portfolio', href: ROUTES.explore },
  { label: 'Pricing', href: ROUTES.pricing },
  { label: 'About', href: ROUTES.about },
  { label: 'How it works', href: NAV_HOW_IT_WORKS_HREF },
] as const;
