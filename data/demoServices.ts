import type { DemoService, SellerBadge, ThumbnailVariant } from '@/types/demoMarketplace';

const sellers = [
  { name: 'Tanvir Ahmed', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'Mahin Studio', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'Jahid Hasan', level: 'Level 2 Seller', badge: 'Level 2 Seller' as SellerBadge },
  { name: 'AI Experts', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'Ad Master', level: 'Level 1 Seller', badge: 'Level 2 Seller' as SellerBadge },
  { name: 'Edit House', level: 'Level 2 Seller', badge: 'Level 2 Seller' as SellerBadge },
  { name: 'UX Studio', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'SEO Pro', level: 'Level 2 Seller', badge: 'Level 2 Seller' as SellerBadge },
  { name: 'Code Factory', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'Design Hub', level: 'New Seller', badge: 'New Seller' as SellerBadge },
  { name: 'Web Builders', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'Fix Agency', level: 'Level 1 Seller', badge: 'New Seller' as SellerBadge },
  { name: 'React Labs', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'NextDev BD', level: 'Level 2 Seller', badge: 'Level 2 Seller' as SellerBadge },
  { name: 'Laravel Pro', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'Shopify BD', level: 'Level 2 Seller', badge: 'Level 2 Seller' as SellerBadge },
  { name: 'Woo Experts', level: 'Level 1 Seller', badge: 'Level 2 Seller' as SellerBadge },
  { name: 'Pixel Craft', level: 'New Seller', badge: 'New Seller' as SellerBadge },
  { name: 'Speed Team', level: 'Level 2 Seller', badge: 'Top Rated Seller' as SellerBadge },
  { name: 'API Bridge', level: 'Level 2 Seller', badge: 'Level 2 Seller' as SellerBadge },
];

function svc(
  i: number,
  title: string,
  sellerIdx: number,
  opts: {
    category: string;
    variant: ThumbnailVariant;
    price: number;
    deliveryDays: number;
    rating?: number;
    reviews?: number;
    tags: string[];
    location?: string;
  }
): DemoService {
  const s = sellers[sellerIdx % sellers.length];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return {
    id: `demo-svc-${i}`,
    slug: `${slug}-${i}`,
    title,
    sellerName: s.name,
    sellerLevel: s.level,
    badge: s.badge,
    category: opts.category,
    thumbnailVariant: opts.variant,
    rating: opts.rating ?? 4.5 + (i % 5) * 0.1,
    reviewCount: opts.reviews ?? 20 + (i * 17) % 400,
    price: opts.price,
    deliveryDays: opts.deliveryDays,
    location: opts.location ?? 'Bangladesh',
    tags: opts.tags,
  };
}

type SeedRow = {
  category: string;
  variant: ThumbnailVariant;
  price: number;
  deliveryDays: number;
  tags: string[];
  rating?: number;
  reviews?: number;
};

const SEED: SeedRow[] = [
  {
    category: 'Website Development',
    variant: 'web',
    price: 8000,
    deliveryDays: 7,
    tags: ['website', 'modern', 'responsive'],
    rating: 4.9,
    reviews: 284,
  },
  {
    category: 'WordPress',
    variant: 'wordpress',
    price: 6000,
    deliveryDays: 5,
    tags: ['wordpress', 'cms', 'website'],
    rating: 4.8,
    reviews: 196,
  },
  {
    category: 'Ecommerce',
    variant: 'ecommerce',
    price: 12000,
    deliveryDays: 10,
    tags: ['shopify', 'ecommerce', 'store'],
    rating: 4.9,
    reviews: 142,
  },
  {
    category: 'AI Services',
    variant: 'ai',
    price: 5000,
    deliveryDays: 3,
    tags: ['ai', 'chatbot', 'automation'],
    rating: 4.7,
    reviews: 88,
  },
  {
    category: 'Digital Marketing',
    variant: 'marketing',
    price: 4000,
    deliveryDays: 3,
    tags: ['facebook ads', 'marketing', 'campaign'],
    rating: 4.6,
    reviews: 210,
  },
  {
    category: 'Video & Animation',
    variant: 'video',
    price: 3000,
    deliveryDays: 2,
    tags: ['video editing', 'reels', 'youtube'],
    rating: 4.8,
    reviews: 167,
  },
  {
    category: 'UI/UX Design',
    variant: 'design',
    price: 6000,
    deliveryDays: 5,
    tags: ['ui ux', 'figma', 'design'],
    rating: 4.9,
    reviews: 95,
  },
  {
    category: 'SEO',
    variant: 'seo',
    price: 3000,
    deliveryDays: 4,
    tags: ['seo', 'on-page', 'optimization'],
    rating: 4.7,
    reviews: 134,
  },
  {
    category: 'Full Stack',
    variant: 'fullstack',
    price: 15000,
    deliveryDays: 14,
    tags: ['full stack', 'react', 'node'],
    rating: 5.0,
    reviews: 62,
  },
  {
    category: 'Landing Page',
    variant: 'landing',
    price: 3500,
    deliveryDays: 3,
    tags: ['landing page', 'conversion', 'design'],
    rating: 4.8,
    reviews: 118,
  },
  {
    category: 'Website Development',
    variant: 'web',
    price: 10000,
    deliveryDays: 10,
    tags: ['custom website', 'business'],
    rating: 4.9,
    reviews: 201,
  },
  {
    category: 'Maintenance',
    variant: 'maintenance',
    price: 2500,
    deliveryDays: 2,
    tags: ['bug fix', 'maintenance', 'support'],
    rating: 4.6,
    reviews: 76,
  },
];

const TITLES: { title: string; sellerIdx: number; seedIdx: number }[] = [
  { title: 'Modern Website Development', sellerIdx: 0, seedIdx: 0 },
  { title: 'WordPress Website Expert', sellerIdx: 1, seedIdx: 1 },
  { title: 'E-commerce Website Shopify Expert', sellerIdx: 2, seedIdx: 2 },
  { title: 'AI Chatbot Automation', sellerIdx: 3, seedIdx: 3 },
  { title: 'Facebook Ads Campaign', sellerIdx: 4, seedIdx: 4 },
  { title: 'Video Editing Professional', sellerIdx: 5, seedIdx: 5 },
  { title: 'UI/UX Design Modern & Clean', sellerIdx: 6, seedIdx: 6 },
  { title: 'SEO On-page Optimization', sellerIdx: 7, seedIdx: 7 },
  { title: 'Full Stack Web Application', sellerIdx: 8, seedIdx: 8 },
  { title: 'Landing Page Design', sellerIdx: 9, seedIdx: 9 },
  { title: 'Custom Website Development', sellerIdx: 10, seedIdx: 10 },
  { title: 'Bug Fix & Website Maintenance', sellerIdx: 11, seedIdx: 11 },
  { title: 'React Website Development', sellerIdx: 12, seedIdx: 0 },
  { title: 'Next.js Website with SSR', sellerIdx: 13, seedIdx: 0 },
  { title: 'Laravel Business Website', sellerIdx: 14, seedIdx: 0 },
  { title: 'Shopify Store Setup & Theme', sellerIdx: 15, seedIdx: 2 },
  { title: 'WooCommerce Store Development', sellerIdx: 16, seedIdx: 2 },
  { title: 'Professional Business Website', sellerIdx: 10, seedIdx: 10 },
  { title: 'Creative Portfolio Website', sellerIdx: 17, seedIdx: 9 },
  { title: 'SaaS Landing Page Design', sellerIdx: 9, seedIdx: 9 },
  { title: 'Mobile App UI Design', sellerIdx: 6, seedIdx: 6 },
  { title: 'Admin Dashboard UI Design', sellerIdx: 6, seedIdx: 6 },
  { title: 'Booking Website Development', sellerIdx: 0, seedIdx: 0 },
  { title: 'LMS Website Development', sellerIdx: 8, seedIdx: 8 },
  { title: 'Restaurant Website with Menu', sellerIdx: 1, seedIdx: 1 },
  { title: 'Real Estate Listing Website', sellerIdx: 10, seedIdx: 10 },
  { title: 'Website Speed Optimization', sellerIdx: 18, seedIdx: 11 },
  { title: 'WordPress to Next.js Migration', sellerIdx: 13, seedIdx: 0 },
  { title: 'Payment Gateway Integration', sellerIdx: 19, seedIdx: 8 },
  { title: 'REST API Integration Service', sellerIdx: 19, seedIdx: 8 },
  { title: 'CRM Development & Setup', sellerIdx: 8, seedIdx: 8 },
  { title: 'Custom Admin Dashboard', sellerIdx: 8, seedIdx: 8 },
  { title: 'React + Tailwind Corporate Site', sellerIdx: 12, seedIdx: 0 },
  { title: 'Next.js Ecommerce Starter', sellerIdx: 13, seedIdx: 2 },
  { title: 'Laravel API Backend', sellerIdx: 14, seedIdx: 8 },
  { title: 'Shopify Dropshipping Store', sellerIdx: 15, seedIdx: 2 },
  { title: 'WooCommerce Multivendor Setup', sellerIdx: 16, seedIdx: 2 },
  { title: 'Startup Business Website Package', sellerIdx: 10, seedIdx: 10 },
  { title: 'Photographer Portfolio Website', sellerIdx: 17, seedIdx: 9 },
  { title: 'SaaS Product Marketing Page', sellerIdx: 9, seedIdx: 9 },
  { title: 'Fintech Mobile App UI', sellerIdx: 6, seedIdx: 6 },
  { title: 'Analytics Dashboard UI Kit', sellerIdx: 6, seedIdx: 6 },
  { title: 'Salon Booking Website', sellerIdx: 0, seedIdx: 0 },
  { title: 'Online Course LMS Platform', sellerIdx: 8, seedIdx: 8 },
  { title: 'Food Delivery Restaurant Site', sellerIdx: 1, seedIdx: 1 },
  { title: 'Property Showcase Real Estate Site', sellerIdx: 10, seedIdx: 10 },
  { title: 'Core Web Vitals Speed Boost', sellerIdx: 18, seedIdx: 11 },
  { title: 'Hostinger to Vercel Migration', sellerIdx: 13, seedIdx: 0 },
  { title: 'bKash & SSLCommerz Payment Setup', sellerIdx: 19, seedIdx: 8 },
  { title: 'Third-party API Integration', sellerIdx: 19, seedIdx: 8 },
  { title: 'HubSpot CRM Customization', sellerIdx: 8, seedIdx: 8 },
  { title: 'React Admin Panel Development', sellerIdx: 12, seedIdx: 8 },
  { title: 'WordPress Elementor Website', sellerIdx: 1, seedIdx: 1 },
  { title: 'Headless Shopify Storefront', sellerIdx: 15, seedIdx: 2 },
  { title: 'Figma to React Website', sellerIdx: 12, seedIdx: 0 },
  { title: 'SEO Technical Audit & Fixes', sellerIdx: 7, seedIdx: 7 },
  { title: 'Google Ads Setup for Website', sellerIdx: 4, seedIdx: 4 },
  { title: 'YouTube Video Editing Package', sellerIdx: 5, seedIdx: 5 },
  { title: 'AI Content Writing Assistant', sellerIdx: 3, seedIdx: 3 },
];

const VARIANT_OVERRIDES: Record<string, ThumbnailVariant> = {
  'React Website Development': 'web',
  'Next.js Website with SSR': 'web',
  'Laravel Business Website': 'web',
  'Shopify Store Setup & Theme': 'ecommerce',
  'WooCommerce Store Development': 'ecommerce',
  'Professional Business Website': 'web',
  'Creative Portfolio Website': 'landing',
  'SaaS Landing Page Design': 'saas',
  'Mobile App UI Design': 'mobile',
  'Admin Dashboard UI Design': 'dashboard',
  'Booking Website Development': 'booking',
  'LMS Website Development': 'lms',
  'Restaurant Website with Menu': 'restaurant',
  'Real Estate Listing Website': 'realestate',
  'Website Speed Optimization': 'speed',
  'WordPress to Next.js Migration': 'migration',
  'Payment Gateway Integration': 'payment',
  'REST API Integration Service': 'api',
  'CRM Development & Setup': 'crm',
  'Custom Admin Dashboard': 'dashboard',
};

export const DEMO_SERVICES: DemoService[] = TITLES.map((row, i) => {
  const seed = SEED[row.seedIdx % SEED.length];
  const variant = VARIANT_OVERRIDES[row.title] ?? seed.variant;
  return svc(i + 1, row.title, row.sellerIdx, {
    category: seed.category,
    variant,
    price: seed.price + (i % 7) * 500,
    deliveryDays: [2, 3, 5, 7, 10, 14][i % 6],
    rating: seed.rating,
    reviews: seed.reviews,
    tags: [...seed.tags, ...row.title.toLowerCase().split(/\s+/).slice(0, 3)],
    location: 'Bangladesh',
  });
});

export const RECENTLY_VIEWED = DEMO_SERVICES.slice(0, 3).map((s) => ({
  id: s.id,
  title: s.title,
  price: s.price,
  variant: s.thumbnailVariant,
}));

export const TRENDING_SERVICES = [
  { label: 'Website Development', count: 12540 },
  { label: 'Ecommerce Development', count: 8420 },
  { label: 'Landing Page Design', count: 6210 },
  { label: 'WordPress Development', count: 9870 },
  { label: 'UI/UX Design', count: 5540 },
] as const;

export const POPULAR_TAGS = [
  'wordpress',
  'react',
  'shopify',
  'ecommerce',
  'landing page',
  'ui ux',
  'seo',
  'business website',
  'custom website',
  'figma',
] as const;

export const SEARCH_POPULAR_CHIPS = [
  'WordPress',
  'React',
  'Next.js',
  'Ecommerce',
  'Shopify',
  'UI/UX',
  'SEO',
  'AI',
] as const;

export const TOTAL_SERVICES_COUNT = 1250;
