import { ROUTES, marketplaceCategorySearchUrl } from '@/lib/routes';
import type { MarketplaceHomeRowConfig } from '@/types/marketplace';

export const MARKETPLACE_HOME_ROWS: MarketplaceHomeRowConfig[] = [
  {
    rowGroup: 'software_development',
    title: 'Software Development',
    subtitle:
      'Custom ERP, CRM, POS & SaaS solutions built for Bangladeshi businesses',
    viewAllHref: marketplaceCategorySearchUrl('software-development'),
    highlight: true,
    sectionBadge: 'For Growing Businesses',
    containerBadge: 'High Value',
  },
  {
    rowGroup: 'web_development',
    title: 'Web Development Features',
    subtitle: 'Business sites, e-commerce, WordPress & high-performance Next.js builds',
    viewAllHref: marketplaceCategorySearchUrl('web-development'),
  },
  {
    rowGroup: 'app_development',
    title: 'App Development Features',
    subtitle: 'Native & cross-platform mobile apps for startups and enterprises',
    viewAllHref: marketplaceCategorySearchUrl('app-development'),
  },
  {
    rowGroup: 'popular',
    title: 'Popular Services',
    subtitle: 'Trending marketing, design & automation services clients love',
    viewAllHref: ROUTES.search,
  },
];
