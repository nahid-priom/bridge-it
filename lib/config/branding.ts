/**
 * Central brand configuration — single source of truth for Deshi Fiverr.
 */
export const BRANDING = {
  appName: 'Deshi Fiverr',
  shortName: 'Deshi Fiverr',
  legalName: 'Deshi Fiverr Marketplace',
  tagline: 'Bangladesh Marketplace',
  description:
    "Bangladesh's trusted freelance marketplace for services and products.",
  primaryColor: '#00A85A',
  accentColor: '#7C3AED',
  supportEmail: 'support@deshifiverr.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deshifiverr.com',
  sellerHub: 'Deshi Fiverr Seller Hub',
  clientWorkspace: 'Deshi Fiverr Client Workspace',
  adminName: 'Deshi Fiverr Admin',
  aiName: 'Deshi Fiverr AI',
} as const;

export const BRAND_KEYWORDS = [
  'freelance marketplace Bangladesh',
  'hire freelancers Bangladesh',
  'Fiverr alternative Bangladesh',
  'digital services Bangladesh',
  'Bangladeshi freelancers',
  'Deshi Fiverr',
  'web development Bangladesh',
  'graphic design freelancer BD',
  'marketplace Bangladesh',
] as const;

export const HOME_SEO_TITLE =
  'Deshi Fiverr | Find the Right Talent. Get Work Done. Grow Your Business.';

/** Public seller profile URL shown in dashboards (host + path). */
export function sellerCustomUrl(slug: string): string {
  const host = BRANDING.siteUrl.replace(/^https?:\/\//, '');
  return `${host}/s/${slug}`;
}
