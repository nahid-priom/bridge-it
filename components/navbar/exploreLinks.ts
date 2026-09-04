import { ROUTES, solutionsUrl } from '@/lib/routes';
import { NAV_HOW_IT_WORKS_HREF } from '@/data/homeContent';

export const EXPLORE_MOBILE_LINKS = [
  { label: 'Software Solutions', href: ROUTES.softwareShowroom },
  { label: 'E-commerce Showroom', href: ROUTES.ecommerceShowroom },
  { label: 'Creative & Digital Marketing', href: ROUTES.creativeMarketingShowroom },
  { label: 'Web & App Solutions', href: solutionsUrl('web-app-solutions') },
  { label: 'Success Stories', href: ROUTES.about },
  { label: 'Help Center', href: NAV_HOW_IT_WORKS_HREF },
] as const;
