import type { CategoryType, Service } from '@/types';
import type { PlatformTestimonial } from '@/types';
import { MAIN_MARKETPLACE_CATEGORIES } from '@/constants/mainMarketplaceCategories';
import { MAIN_PRODUCT_CATEGORIES } from '@/constants/mainProductCategories';
import { ROUTES, productsUrl, searchUrl } from '@/lib/routes';

/* ─── Hero ─── */
export const HERO_BADGE = "Bangladesh's Trusted Freelance Marketplace";

export const HERO_HEADLINE_LINES = [
  'Find the Right Talent.',
  'Get Work Done.',
  'Grow Your Business.',
] as const;

export const HERO_DESCRIPTION =
  'Connect with verified Bangladeshi freelancers for 500+ digital services and take your business to the next level.';

/** Static fallback for inputs / accessibility */
export const HERO_SEARCH_PLACEHOLDER =
  'Search for website development, logo design, video editing, and more';

export const HERO_SEARCH_TYPE_PREFIX = 'Search for ';

export const HERO_SEARCH_TYPEWRITER_PHRASES = [
  'website development…',
  'ERP software…',
  'Android app…',
  'Facebook ads…',
  'AI chatbot…',
  'ecommerce website…',
  'Next.js website…',
  'SEO optimization…',
] as const;

export const HERO_TRUST_STATS = [
  {
    id: 'services',
    label: '500+ Services',
    icon: 'briefcase' as const,
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'freelancers',
    label: '10,000+ Freelancers',
    icon: 'users' as const,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'satisfaction',
    label: '98% Client Satisfaction',
    icon: 'shield' as const,
    iconBg: 'bg-violet-100 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    id: 'support',
    label: '24/7 Support',
    icon: 'headphones' as const,
    iconBg: 'bg-sky-100 dark:bg-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
];

export const HERO_CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  ...MAIN_MARKETPLACE_CATEGORIES.map((c) => ({
    label: c.name,
    value: c.slug,
  })),
] as const;

/* ─── Browse Popular Categories (6) ─── */
export type HomeCategoryItem = {
  id: string;
  name: string;
  icon: string;
  color: string;
  href: string;
  categoryId?: CategoryType;
  /** Short label for compact cards */
  subtitle?: string;
};

export const HOME_CATEGORY_GRID: HomeCategoryItem[] = [
  {
    id: 'web',
    name: 'Web Development',
    icon: '💻',
    color: '#3B82F6',
    href: searchUrl('web development'),
    categoryId: 'web-development',
    subtitle: 'Websites & landing pages',
  },
  {
    id: 'app',
    name: 'App Development',
    icon: '📱',
    color: '#8B5CF6',
    href: searchUrl('app development'),
    subtitle: 'iOS, Android & cross-platform',
  },
  {
    id: 'software',
    name: 'Software Development',
    icon: '⚙️',
    color: '#6366F1',
    href: productsUrl('software'),
    categoryId: 'software',
    subtitle: 'Custom software & SaaS',
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    icon: '📣',
    color: '#10B981',
    href: productsUrl('digital-marketing'),
    categoryId: 'digital-marketing',
    subtitle: 'SEO, ads & social media',
  },
  {
    id: 'ai',
    name: 'AI & Automations',
    icon: '🤖',
    color: '#06B6D4',
    href: searchUrl('AI automation'),
    subtitle: 'Chatbots & workflows',
  },
  {
    id: 'more',
    name: 'More',
    icon: '➕',
    color: '#94A3B8',
    href: ROUTES.categories,
    subtitle: '500+ categories',
  },
];

/** @deprecated Use marketplace home data; kept for legacy FeaturedServices only */
export function mergePopularServices(dbServices: Service[], limit = 8): Service[] {
  if (dbServices.length === 0) return [];
  const seen = new Set<string>();
  const merged: Service[] = [];
  for (const s of dbServices) {
    if (merged.length >= limit) break;
    if (!seen.has(s.id)) {
      merged.push(s);
      seen.add(s.id);
    }
  }
  return merged;
}

/* ─── Benefits ─── */
export const FREELANCER_BENEFITS = [
  {
    title: 'Access top talent',
    description: 'Explore 500+ categories of professional services.',
    icon: 'users' as const,
    color: '#10B981',
  },
  {
    title: 'Quality work',
    description: 'Work with verified professionals delivering top-quality results.',
    icon: 'award' as const,
    color: '#7C3AED',
  },
  {
    title: 'On time, every time',
    description: 'Clear timelines and on-time delivery you can rely on.',
    icon: 'clock' as const,
    color: '#F59E0B',
  },
  {
    title: "Pay when you're happy",
    description: 'Secure payments. Pay only when you are satisfied.',
    icon: 'wallet' as const,
    color: '#38BDF8',
  },
];

/* ─── How it works (5 steps) ─── */
export const HOW_IT_WORKS_STEPS = [
  { num: 1, title: 'Find a Service', description: 'Search or browse services that you need.' },
  { num: 2, title: 'Choose a Freelancer', description: 'Review profiles and select the best match.' },
  { num: 3, title: 'Discuss & Order', description: 'Discuss requirements and place your order.' },
  { num: 4, title: 'Get Work Done', description: 'Freelancer delivers high quality work.' },
  { num: 5, title: 'Review & Pay', description: 'Review the work and release payment securely.' },
];

const AVATAR = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=80&w=80`;

/* ─── Top freelancers ─── */
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

export const HOME_FREELANCERS: HomeFreelancerCard[] = [
  { id: 'f1', name: 'Rasel Ahmed', title: 'Full Stack Developer', rating: 4.9, reviewCount: 210, priceFrom: 18000, avatar: AVATAR(6804068), slug: 'rasel-ahmed' },
  { id: 'f2', name: 'Sumaiya Akter', title: 'UI/UX Designer', rating: 4.9, reviewCount: 195, priceFrom: 8000, avatar: AVATAR(6804071), slug: 'sumaiya-akter' },
  { id: 'f3', name: 'Mahfuzur Rahman', title: 'Digital Marketer', rating: 4.8, reviewCount: 187, priceFrom: 6000, avatar: AVATAR(7988747), slug: 'mahfuzur-rahman' },
  { id: 'f4', name: 'Nusrat Jahan', title: 'Content Writer', rating: 4.9, reviewCount: 174, priceFrom: 4500, avatar: AVATAR(291777), slug: 'nusrat-jahan' },
  { id: 'f5', name: 'Tanvir Hasan', title: 'Video Editor', rating: 4.8, reviewCount: 160, priceFrom: 4000, avatar: AVATAR(20313664), slug: 'tanvir-hasan' },
];

/* ─── Testimonials ─── */
export const HOME_TESTIMONIALS: PlatformTestimonial[] = [
  {
    id: 't1',
    name: 'Afif Hossain',
    role: 'CEO, TechCorp BD',
    comment:
      'Deshi Fiverr helped us build our website exactly how we imagined. Great experience and fast delivery!',
    rating: 5,
    accentColor: '#10B981',
  },
  {
    id: 't2',
    name: 'Jannatul Ferdous',
    role: 'Marketing Manager',
    comment:
      'Found a fantastic designer for our brand logo. Very professional and easy to work with.',
    rating: 5,
    accentColor: '#7C3AED',
  },
  {
    id: 't3',
    name: 'Riyad Mahmud',
    role: 'Founder, ShopBase',
    comment:
      'The video ads created by the freelancer increased our sales by 3x. Highly recommended!',
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
  title: 'Join thousands of businesses and talented freelancers on Deshi Fiverr',
  subtitle: 'Start your journey today and get things done.',
};

/* ─── Trust strip ─── */
export const TRUST_SECURITY_ITEMS = [
  {
    title: 'Secure Payments',
    description: 'Your payments are safe with our escrow system.',
    icon: 'lock' as const,
  },
  {
    title: 'Money Back Guarantee',
    description: 'Not satisfied? Get your money back.',
    icon: 'shield' as const,
  },
  {
    title: 'Data Protection',
    description: 'We keep your data safe and secure.',
    icon: 'database' as const,
  },
  {
    title: '24/7 Support',
    description: 'Our support team is always here to help you.',
    icon: 'headphones' as const,
  },
];

/* ─── Footer links ─── */
export const FOOTER_BRAND_DESCRIPTION =
  'Bangladesh-first freelance marketplace where businesses connect with talented freelancers to get work done.';

export const FOOTER_COLUMNS = {
  buyers: [
    { label: 'Browse Services', href: ROUTES.search },
    { label: 'How It Works', href: `${ROUTES.home}#how-it-works` },
    { label: 'Payment & Security', href: ROUTES.about },
    { label: 'Buyer Protection', href: ROUTES.about },
    { label: 'Help & Support', href: ROUTES.about },
  ],
  sellers: [
    { label: 'Become a Seller', href: ROUTES.sellerOnboarding },
    { label: 'Seller Resources', href: ROUTES.about },
    { label: 'Success Stories', href: ROUTES.about },
    { label: 'Community', href: ROUTES.about },
    { label: 'Seller Support', href: ROUTES.about },
  ],
  categories: MAIN_PRODUCT_CATEGORIES.map((c) => ({
    label: c.name,
    href: `${ROUTES.products}?category=${encodeURIComponent(c.slug)}`,
  })),
  company: [
    { label: 'About Us', href: ROUTES.about },
    { label: 'Careers', href: ROUTES.about },
    { label: 'Blog', href: ROUTES.about },
    { label: 'Terms of Service', href: ROUTES.about },
    { label: 'Privacy Policy', href: ROUTES.about },
  ],
} as const;

export const HOME_SECTION_IDS = {
  howItWorks: 'how-it-works',
  categories: 'service-categories',
  popular: 'popular-services',
} as const;

export const NAV_HOW_IT_WORKS_HREF = `${ROUTES.home}#${HOME_SECTION_IDS.howItWorks}`;

/** @deprecated use HERO_DESCRIPTION */
export const HERO_SUBHEADLINE = HERO_DESCRIPTION;
/** @deprecated */
export const HERO_HEADLINE = HERO_HEADLINE_LINES.join(' ');
