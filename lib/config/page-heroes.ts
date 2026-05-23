import { BRANDING } from '@/lib/config/branding';

/** Shared hero copy — keep in sync with PageHero usage across the app. */
export const PAGE_HEROES = {
  home: {
    eyebrow: "Bangladesh's Trusted Freelance Marketplace",
    title: 'Find the Right Talent.',
    highlightedText: 'Get Work Done.',
    accentLine: 'Grow Your Business.',
  },
  search: {
    title: 'Find the Best',
    highlightedText: 'Web Development',
    accentLine: 'Services.',
    subtitle: `Search ${BRANDING.appName} for verified freelancers, digital products, and business services.`,
  },
  products: {
    title: 'Discover Premium',
    highlightedText: 'Business Products.',
    subtitle: `Shop trusted services and digital products from verified ${BRANDING.appName} sellers.`,
  },
  sellerLanding: {
    title: 'Build Better',
    highlightedText: 'Digital Solutions',
    accentLine: '.',
    subtitle: `Showcase your skills and grow on ${BRANDING.sellerHub}.`,
  },
  clientDashboard: {
    title: 'Manage Your',
    highlightedText: 'Projects Easily.',
    subtitle: BRANDING.clientWorkspace,
  },
  sellerDashboard: {
    title: 'Grow Your',
    highlightedText: 'Marketplace Business.',
    subtitle: BRANDING.sellerHub,
  },
  admin: {
    title: 'Manage The',
    highlightedText: 'Marketplace System.',
    subtitle: BRANDING.adminName,
  },
} as const;
