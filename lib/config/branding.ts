/**
 * Central brand configuration — Bridge IT Park.
 */
export const BRANDING = {
  appName: 'Bridge IT Park',
  shortName: 'Bridge IT Park',
  legalName: 'Bridge IT Park',
  tagline: 'Websites, Software Solutions & Creative Marketing',
  description:
    'Custom e-commerce websites, software solutions, and creative & digital marketing for Bangladesh businesses.',
  primaryColor: '#0f2744',
  accentColor: '#10B981',
  navyColor: '#0f2744',
  blueColor: '#2563eb',
  emeraldColor: '#10B981',
  supportEmail: 'support@bridgeitpark.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.bridgeitpark.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  clientWorkspace: 'Bridge IT Park Client Dashboard',
  adminName: 'Bridge IT Park Admin',
  aiName: 'Bridge IT Park Assistant',
} as const;

export const BRAND_KEYWORDS = [
  'custom e-commerce website',
  'software solutions Bangladesh',
  'creative digital marketing bangladesh',
  'graphic design services bangladesh',
  'facebook ads management bangladesh',
  'digital marketing agency bangladesh',
  'Bridge IT Park',
  'Code Bondhu IT',
] as const;

export const HOME_SEO_TITLE =
  'Websites, Software & Creative Marketing | Bridge IT Park';

export const HOME_SEO_DESCRIPTION =
  'Custom websites, software solutions, and creative & Digital Marketing - design, Meta ads and growth services for your business.';

export function whatsappUrl(message: string) {
  const digits = BRANDING.whatsappNumber.replace(/\D/g, '');
  const text = encodeURIComponent(message);
  if (digits) return `https://wa.me/${digits}?text=${text}`;
  return `https://wa.me/?text=${text}`;
}

export function solutionUrl(slug: string): string {
  return `/solutions/${slug}`;
}

/** @deprecated */
export function sellerCustomUrl(slug: string): string {
  const host = BRANDING.siteUrl.replace(/^https?:\/\//, '');
  return `${host}/solutions/${slug}`;
}
