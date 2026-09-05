import type { PlatformTestimonial } from '@/types';
import { ROUTES, solutionsUrl, searchUrl } from '@/lib/routes';

/* ─── Hero ─── */
export const HERO_BADGE = 'Your Complete Digital Business Partner';

export const HERO_HEADLINE_LINES = [
  'Build. Market. Grow.',
  'Your Business,',
  'All in One Place.',
] as const;

export const HERO_HIGHLIGHT = 'All in One Place.';

export const HERO_DESCRIPTION =
  'Software, Website, Digital Marketing & Creative Solutions for Growing Businesses.';

export const HERO_SEARCH_PLACEHOLDER = 'Search Software, Website, Marketing...';

export const HERO_SEARCH_TYPE_PREFIX = 'Search for ';

export const HERO_SEARCH_TYPEWRITER_PHRASES = [
  'custom ERP software…',
  'ecommerce website…',
  'Meta ads management…',
  'logo & brand identity…',
  'mobile app development…',
  'SEO service…',
  'POS software…',
  'social media design…',
] as const;

export const HERO_TRUST_STATS = [
  {
    id: 'solutions',
    label: 'Digital Solutions',
    icon: 'briefcase' as const,
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'projects',
    label: 'Projects Delivered',
    icon: 'users' as const,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'satisfaction',
    label: 'Client Satisfaction',
    icon: 'shield' as const,
    iconBg: 'bg-blue-100 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'support',
    label: 'Dedicated Support',
    icon: 'headphones' as const,
    iconBg: 'bg-sky-100 dark:bg-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
];

export const HERO_CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: 'Software Solutions', value: 'software-solutions' },
  { label: 'Web & App Solutions', value: 'web-app-solutions' },
  { label: 'Creative & Digital Marketing', value: 'creative-digital-marketing' },
] as const;

/* ─── Why Bridge IT Park ─── */
export const WHY_BRIDGE_IT_PARK = [
  {
    title: 'All-in-One Digital Partner',
    description: 'Software, websites, marketing, and creative — everything under one roof.',
    icon: 'layers' as const,
    color: '#10B981',
  },
  {
    title: 'Business-First Solutions',
    description: 'Built for growing businesses — clear pricing, reliable delivery, real results.',
    icon: 'award' as const,
    color: '#14B8A6',
  },
  {
    title: 'On-Time Delivery',
    description: 'Structured project timelines with milestone tracking you can follow.',
    icon: 'clock' as const,
    color: '#F59E0B',
  },
  {
    title: 'Transparent Pricing',
    description: 'Choose a package or request a custom quote — no hidden surprises.',
    icon: 'wallet' as const,
    color: '#38BDF8',
  },
];

/* ─── How it works ─── */
export const HOW_IT_WORKS_STEPS = [
  { num: 1, title: 'Browse Solutions', description: 'Explore our digital services by category or search.' },
  { num: 2, title: 'Choose a Package', description: 'Select the package that fits your business needs.' },
  { num: 3, title: 'Submit Requirements', description: 'Tell us about your project with our simple form.' },
  { num: 4, title: 'We Build & Deliver', description: 'Our team works on your project with regular updates.' },
];

/* ─── Testimonials fallback ─── */
export const HOME_TESTIMONIALS: PlatformTestimonial[] = [
  {
    id: 't1',
    name: 'Afif Hossain',
    role: 'CEO, TechCorp BD',
    comment:
      'Bridge IT Park built our ecommerce website exactly how we needed. Professional team and fast delivery!',
    rating: 5,
    accentColor: '#10B981',
  },
  {
    id: 't2',
    name: 'Jannatul Ferdous',
    role: 'Marketing Manager',
    comment:
      'Their Meta ads management increased our online sales significantly. Highly recommended!',
    rating: 5,
    accentColor: '#14B8A6',
  },
  {
    id: 't3',
    name: 'Riyad Mahmud',
    role: 'Founder, ShopBase',
    comment:
      'From website to branding — Bridge IT Park handled everything. Great experience throughout.',
    rating: 5,
    accentColor: '#38BDF8',
  },
];

export function mergeTestimonials(db: PlatformTestimonial[]): PlatformTestimonial[] {
  if (db.length >= 3) return db.slice(0, 6);
  const seen = new Set(db.map((t) => t.id));
  const merged = [...db];
  for (const t of HOME_TESTIMONIALS) {
    if (merged.length >= 6) break;
    if (!seen.has(t.id)) {
      merged.push(t);
      seen.add(t.id);
    }
  }
  return merged.length ? merged : HOME_TESTIMONIALS;
}

/* ─── CTA banner ─── */
export const HOME_CTA = {
  title: 'Ready to Take Your Business Digital?',
  subtitle: 'Get a free consultation and discover the right solution for your business.',
};

/* ─── Trust strip ─── */
export const TRUST_SECURITY_ITEMS = [
  {
    title: 'Secure Payments',
    description: 'Your payments are tracked and verified securely.',
    icon: 'lock' as const,
  },
  {
    title: 'Quality Guarantee',
    description: 'We stand behind our work with revision support.',
    icon: 'shield' as const,
  },
  {
    title: 'Data Protection',
    description: 'Your business data is kept safe and confidential.',
    icon: 'database' as const,
  },
  {
    title: 'Dedicated Support',
    description: 'Our team is here to help throughout your project.',
    icon: 'headphones' as const,
  },
];

/* ─── Footer links ─── */
export const FOOTER_BRAND_TAGLINE = 'BUILD • MARKET • GROW';

export const FOOTER_BRAND_HEADLINE = 'Control Your Business in One Dashboard';

export const FOOTER_BRAND_DESCRIPTION = 'Grow Smarter with Bridge IT Park';

export const FOOTER_COLUMNS = {
  services: [
    { label: 'Websites', href: ROUTES.websites },
    { label: 'Software Solutions', href: ROUTES.softwareShowroom },
    { label: 'Creative & Digital Marketing', href: ROUTES.creativeMarketingShowroom },
    { label: 'Consultation', href: ROUTES.consultation },
  ],
  explore: [
    { label: 'Explore Catalog', href: ROUTES.explore },
    { label: 'Portfolio', href: ROUTES.portfolio },
    { label: 'Pricing', href: ROUTES.pricing },
    { label: 'About', href: ROUTES.about },
  ],
  popular: [
    { label: 'Garments ERP', href: ROUTES.softwareProduct('garments', 'garments-erp') },
    { label: 'Feed Mill ERP', href: ROUTES.softwareProduct('feed-mill', 'feed-mill-erp') },
    { label: 'Retail POS', href: ROUTES.softwareProduct('retail-pos', 'retail-pos') },
    { label: 'CRM System', href: ROUTES.softwareProduct('crm', 'crm-system') },
    { label: 'E-commerce Websites', href: ROUTES.websites },
  ],
  legal: [
    { label: 'Privacy Policy', href: ROUTES.privacy },
    { label: 'Terms & Conditions', href: ROUTES.terms },
  ],
  /** @deprecated Use services */
  solutions: [
    { label: 'Websites', href: ROUTES.websites },
    { label: 'Software', href: ROUTES.softwareShowroom },
    { label: 'Creative & Marketing', href: ROUTES.creativeMarketingShowroom },
    { label: 'Consultation', href: ROUTES.consultation },
  ],
  /** @deprecated Use explore */
  quickLinks: [
    { label: 'About Us', href: ROUTES.about },
    { label: 'Pricing', href: ROUTES.pricing },
    { label: 'Portfolio', href: ROUTES.portfolio },
    { label: 'Client Dashboard', href: ROUTES.dashboard },
  ],
} as const;

export const HOME_SECTION_IDS = {
  howItWorks: 'how-it-works',
  categories: 'solution-categories',
  popular: 'popular-solutions',
} as const;

export const NAV_HOW_IT_WORKS_HREF = `${ROUTES.home}#${HOME_SECTION_IDS.howItWorks}`;

/** @deprecated use HERO_DESCRIPTION */
export const HERO_SUBHEADLINE = HERO_DESCRIPTION;
/** @deprecated */
export const HERO_HEADLINE = HERO_HEADLINE_LINES.join(' ');

/** @deprecated Use WHY_BRIDGE_IT_PARK */
export const FREELANCER_BENEFITS = WHY_BRIDGE_IT_PARK.map((b) => ({
  ...b,
  icon: b.icon === 'layers' ? ('users' as const) : b.icon,
}));

/** @deprecated Legacy category grid */
export type HomeCategoryItem = {
  id: string;
  name: string;
  icon: string;
  color: string;
  href: string;
  categoryId?: string;
  subtitle?: string;
};

export const HOME_CATEGORY_GRID: HomeCategoryItem[] = [
  {
    id: 'software',
    name: 'Software Solutions',
    icon: 'software',
    color: '#10B981',
    href: ROUTES.softwareShowroom,
    subtitle: 'ERP, POS, CRM, HRM and industry software',
  },
  {
    id: 'web',
    name: 'E-commerce Solutions',
    icon: 'web',
    color: '#0d9488',
    href: ROUTES.ecommerceShowroom,
    subtitle: 'Online stores from ৳2K to ৳50K',
  },
  {
    id: 'app',
    name: 'Web & App',
    icon: 'app',
    color: '#2563eb',
    href: solutionsUrl('web-app-solutions'),
    subtitle: 'Websites and mobile apps',
  },
  {
    id: 'marketing',
    name: 'Creative & Digital Marketing',
    icon: 'marketing',
    color: '#f59e0b',
    href: ROUTES.creativeMarketingShowroom,
    subtitle: 'Design, Meta ads and growth',
  },
  {
    id: 'more',
    name: 'All Solutions',
    icon: 'more',
    color: '#64748b',
    href: ROUTES.solutions,
    subtitle: 'Browse full catalog',
  },
];

export type HomeFreelancerCard = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  avatar: string;
  slug: string;
};

/** @deprecated Removed freelancer marketplace */
export const HOME_FREELANCERS: HomeFreelancerCard[] = [];

/** @deprecated */
export function mergePopularServices(dbServices: import('@/types').Service[], limit = 8): import('@/types').Service[] {
  return dbServices.slice(0, limit);
}
