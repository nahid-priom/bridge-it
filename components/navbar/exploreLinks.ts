import { ROUTES, solutionsUrl } from '@/lib/routes';
import { NAV_HOW_IT_WORKS_HREF } from '@/data/homeContent';

export const EXPLORE_MOBILE_LINKS = [
  { label: 'Software Showroom', href: ROUTES.softwareShowroom },
  { label: 'E-commerce Showroom', href: ROUTES.ecommerceShowroom },
  { label: 'Web & App Solutions', href: solutionsUrl('web-app-solutions') },
  { label: 'Digital Marketing', href: solutionsUrl('digital-marketing') },
  { label: 'Graphics & Creative', href: solutionsUrl('graphics-creative') },
  { label: 'Success Stories', href: ROUTES.about },
  { label: 'Help Center', href: NAV_HOW_IT_WORKS_HREF },
] as const;
