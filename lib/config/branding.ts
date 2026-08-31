/**
 * Central brand configuration — Bridge IT Park.
 */
export const BRANDING = {
  appName: 'Bridge IT Park',
  shortName: 'Bridge IT Park',
  legalName: 'Bridge IT Park',
  tagline: 'Build. Market. Grow.',
  description:
    'Software, Website, Digital Marketing & Creative Solutions for Growing Businesses.',
  primaryColor: '#0f2744',
  accentColor: '#10B981',
  navyColor: '#0f2744',
  blueColor: '#2563eb',
  emeraldColor: '#10B981',
  supportEmail: 'support@bridgeitpark.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bridgeitpark.com',
  clientWorkspace: 'Bridge IT Park Client Dashboard',
  adminName: 'Bridge IT Park Admin',
  aiName: 'Bridge IT Park Assistant',
} as const;

export const BRAND_KEYWORDS = [
  'digital solutions Bangladesh',
  'custom software development',
  'ecommerce website Bangladesh',
  'digital marketing Bangladesh',
  'business website development',
  'ERP software Bangladesh',
  'Bridge IT Park',
  'web development Bangladesh',
  'logo design Bangladesh',
  'business solutions',
] as const;

export const HOME_SEO_TITLE =
  'Bridge IT Park | Build. Market. Grow. Your Business, All in One Place.';

export function solutionUrl(slug: string): string {
  return `/solutions/${slug}`;
}

/** @deprecated */
export function sellerCustomUrl(slug: string): string {
  const host = BRANDING.siteUrl.replace(/^https?:\/\//, '');
  return `${host}/solutions/${slug}`;
}
