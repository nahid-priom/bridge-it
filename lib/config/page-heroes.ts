import { BRANDING } from '@/lib/config/branding';

/** Shared hero copy — keep in sync with PageHero usage across the app. */
export const PAGE_HEROES = {
  home: {
    eyebrow: 'Your Complete Digital Business Partner',
    title: 'Build. Market. Grow.',
    highlightedText: 'Your Business,',
    accentLine: 'All in One Place.',
  },
  search: {
    title: 'Find the Best',
    highlightedText: 'Digital Solutions',
    accentLine: 'for Your Business.',
    subtitle: `Search ${BRANDING.appName} for software, websites, marketing, and creative services.`,
  },
  products: {
    title: 'Explore Our',
    highlightedText: 'Digital Solutions.',
    subtitle: 'Software, websites, marketing, and creative services for growing businesses.',
  },
  solutions: {
    title: 'Explore Our',
    highlightedText: 'Digital Solutions.',
    subtitle: 'Software, websites, marketing, and creative services for growing businesses.',
  },
  pricing: {
    title: 'Transparent',
    highlightedText: 'Service Pricing.',
    subtitle: 'Browse packages by solution or request a custom quote.',
  },
  portfolio: {
    title: 'Featured',
    highlightedText: 'Projects.',
    subtitle: 'See how we help businesses grow digitally.',
  },
  clientDashboard: {
    title: 'Manage Your',
    highlightedText: 'Projects Easily.',
    subtitle: BRANDING.clientWorkspace,
  },
  admin: {
    title: 'Manage',
    highlightedText: 'Bridge IT Park.',
    subtitle: BRANDING.adminName,
  },
  sellerLanding: {
    title: 'Build Better',
    highlightedText: 'Digital Solutions',
    accentLine: '.',
    subtitle: `Get started with ${BRANDING.appName}.`,
  },
  sellerDashboard: {
    title: 'Admin',
    highlightedText: 'Operations.',
    subtitle: BRANDING.adminName,
  },
} as const;
