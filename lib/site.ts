import { BRANDING, BRAND_KEYWORDS, HOME_SEO_DESCRIPTION, HOME_SEO_TITLE } from '@/lib/config/branding';

export { BRANDING, HOME_SEO_DESCRIPTION, HOME_SEO_TITLE };

export const SITE_URL = BRANDING.siteUrl;
export const SITE_NAME = BRANDING.appName;
export const SITE_BRAND = BRANDING.shortName;
export const SITE_DESCRIPTION = BRANDING.description;
export const SITE_KEYWORDS = [...BRAND_KEYWORDS];
