import {
  MAIN_CATEGORY_EMOJI,
  MAIN_MARKETPLACE_CATEGORIES,
} from '@/constants/mainMarketplaceCategories';
import type {
  MarketplaceCategory,
  MarketplaceHomeData,
  MarketplaceRowGroup,
  MarketplaceService,
} from '@/types/marketplace';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const SELLERS = [
  'CodeBridge BD',
  'TechPark Solutions',
  'Dhaka Dev Studio',
  'CloudNine IT',
  'NexGen Bangladesh',
  'Studio 71 Digital',
  'GreenCode Labs',
  'ByteForge BD',
] as const;

type Seed = {
  title: string;
  priceFrom: number;
  categorySlug: string;
  rowGroup: MarketplaceRowGroup;
  deliveryDays: number;
  tags: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
  sortOrder: number;
};

const SERVICE_SEEDS: Seed[] = [
  // Software Development
  { title: 'ERP System Development', priceFrom: 180000, categorySlug: 'software-development', rowGroup: 'software_development', deliveryDays: 45, tags: ['erp', 'software', 'enterprise', 'sme'], isFeatured: true, sortOrder: 1 },
  { title: 'POS Software', priceFrom: 45000, categorySlug: 'software-development', rowGroup: 'software_development', deliveryDays: 25, tags: ['pos', 'retail', 'inventory'], isPopular: true, sortOrder: 2 },
  { title: 'CRM Development', priceFrom: 65000, categorySlug: 'software-development', rowGroup: 'software_development', deliveryDays: 30, tags: ['crm', 'sales', 'software'], sortOrder: 3 },
  { title: 'SaaS Platform', priceFrom: 150000, categorySlug: 'software-development', rowGroup: 'software_development', deliveryDays: 50, tags: ['saas', 'platform', 'dashboard'], isFeatured: true, sortOrder: 4 },
  { title: 'School Management System', priceFrom: 85000, categorySlug: 'software-development', rowGroup: 'software_development', deliveryDays: 40, tags: ['school', 'education', 'management'], sortOrder: 5 },
  { title: 'Inventory Management', priceFrom: 55000, categorySlug: 'software-development', rowGroup: 'software_development', deliveryDays: 28, tags: ['inventory', 'warehouse', 'stock'], sortOrder: 6 },
  { title: 'Distribution ERP', priceFrom: 200000, categorySlug: 'software-development', rowGroup: 'software_development', deliveryDays: 55, tags: ['erp', 'distribution', 'sales'], isFeatured: true, sortOrder: 7 },
  { title: 'HRM Software', priceFrom: 90000, categorySlug: 'software-development', rowGroup: 'software_development', deliveryDays: 35, tags: ['hrm', 'hr', 'payroll'], sortOrder: 8 },
  // Web Development
  { title: 'Business Website', priceFrom: 12000, categorySlug: 'web-development', rowGroup: 'web_development', deliveryDays: 10, tags: ['website', 'business', 'corporate'], isPopular: true, sortOrder: 1 },
  { title: 'Ecommerce Website', priceFrom: 28000, categorySlug: 'web-development', rowGroup: 'web_development', deliveryDays: 14, tags: ['ecommerce', 'website', 'online-store'], isFeatured: true, sortOrder: 2 },
  { title: 'Landing Page', priceFrom: 6000, categorySlug: 'web-development', rowGroup: 'web_development', deliveryDays: 5, tags: ['landing-page', 'website', 'conversion'], sortOrder: 3 },
  { title: 'Next.js Website', priceFrom: 35000, categorySlug: 'web-development', rowGroup: 'web_development', deliveryDays: 14, tags: ['nextjs', 'website', 'react'], isPopular: true, sortOrder: 4 },
  { title: 'WordPress Website', priceFrom: 10000, categorySlug: 'web-development', rowGroup: 'web_development', deliveryDays: 7, tags: ['wordpress', 'website', 'cms'], sortOrder: 5 },
  { title: 'Portfolio Website', priceFrom: 8000, categorySlug: 'web-development', rowGroup: 'web_development', deliveryDays: 5, tags: ['portfolio', 'website', 'personal'], sortOrder: 6 },
  { title: 'Shopify Store', priceFrom: 18000, categorySlug: 'web-development', rowGroup: 'web_development', deliveryDays: 10, tags: ['shopify', 'ecommerce', 'store'], sortOrder: 7 },
  { title: 'Website Optimization', priceFrom: 5000, categorySlug: 'web-development', rowGroup: 'web_development', deliveryDays: 3, tags: ['website', 'speed', 'performance', 'seo-technical'], sortOrder: 8 },
  // App Development
  { title: 'Android App', priceFrom: 45000, categorySlug: 'app-development', rowGroup: 'app_development', deliveryDays: 21, tags: ['android', 'mobile-app', 'app'], isPopular: true, sortOrder: 1 },
  { title: 'iOS App', priceFrom: 60000, categorySlug: 'app-development', rowGroup: 'app_development', deliveryDays: 28, tags: ['ios', 'mobile-app', 'app'], sortOrder: 2 },
  { title: 'Flutter App', priceFrom: 65000, categorySlug: 'app-development', rowGroup: 'app_development', deliveryDays: 28, tags: ['flutter', 'cross-platform', 'app'], sortOrder: 3 },
  { title: 'React Native App', priceFrom: 70000, categorySlug: 'app-development', rowGroup: 'app_development', deliveryDays: 30, tags: ['react-native', 'mobile-app', 'app'], isFeatured: true, sortOrder: 4 },
  { title: 'Delivery App', priceFrom: 120000, categorySlug: 'app-development', rowGroup: 'app_development', deliveryDays: 45, tags: ['delivery', 'logistics', 'app'], isFeatured: true, sortOrder: 5 },
  { title: 'Ecommerce App', priceFrom: 95000, categorySlug: 'app-development', rowGroup: 'app_development', deliveryDays: 40, tags: ['ecommerce', 'mobile-app', 'marketplace'], sortOrder: 6 },
  { title: 'Booking App', priceFrom: 85000, categorySlug: 'app-development', rowGroup: 'app_development', deliveryDays: 35, tags: ['booking', 'appointment', 'app'], isPopular: true, sortOrder: 7 },
  { title: 'LMS App', priceFrom: 110000, categorySlug: 'app-development', rowGroup: 'app_development', deliveryDays: 42, tags: ['lms', 'education', 'app'], sortOrder: 8 },
  // Digital Marketing
  { title: 'Facebook Ads', priceFrom: 5000, categorySlug: 'digital-marketing', rowGroup: 'popular', deliveryDays: 3, tags: ['facebook-ads', 'social-media', 'marketing'], isPopular: true, sortOrder: 1 },
  { title: 'Google Ads', priceFrom: 8000, categorySlug: 'digital-marketing', rowGroup: 'popular', deliveryDays: 5, tags: ['google-ads', 'ppc', 'marketing'], sortOrder: 2 },
  { title: 'SEO Optimization', priceFrom: 10000, categorySlug: 'digital-marketing', rowGroup: 'popular', deliveryDays: 7, tags: ['seo', 'search', 'marketing'], isPopular: true, sortOrder: 3 },
  { title: 'Social Media Marketing', priceFrom: 7000, categorySlug: 'digital-marketing', rowGroup: 'popular', deliveryDays: 5, tags: ['social-media', 'marketing', 'content'], sortOrder: 4 },
  { title: 'Content Strategy', priceFrom: 6000, categorySlug: 'digital-marketing', rowGroup: 'popular', deliveryDays: 5, tags: ['content', 'strategy', 'marketing'], sortOrder: 5 },
  { title: 'Lead Generation', priceFrom: 12000, categorySlug: 'digital-marketing', rowGroup: 'popular', deliveryDays: 10, tags: ['leads', 'funnel', 'marketing'], sortOrder: 6 },
  { title: 'Funnel Setup', priceFrom: 15000, categorySlug: 'digital-marketing', rowGroup: 'popular', deliveryDays: 10, tags: ['funnel', 'conversion', 'marketing'], isFeatured: true, sortOrder: 7 },
  { title: 'Video Marketing', priceFrom: 9000, categorySlug: 'digital-marketing', rowGroup: 'popular', deliveryDays: 6, tags: ['video', 'marketing', 'ads'], sortOrder: 8 },
  // AI & Automations
  { title: 'AI Chatbot', priceFrom: 15000, categorySlug: 'ai-automations', rowGroup: 'popular', deliveryDays: 10, tags: ['ai', 'chatbot', 'automation'], isFeatured: true, sortOrder: 9 },
  { title: 'WhatsApp Automation', priceFrom: 12000, categorySlug: 'ai-automations', rowGroup: 'popular', deliveryDays: 7, tags: ['whatsapp', 'automation', 'messaging'], isPopular: true, sortOrder: 10 },
  { title: 'CRM Automation', priceFrom: 18000, categorySlug: 'ai-automations', rowGroup: 'popular', deliveryDays: 12, tags: ['crm', 'automation', 'workflow'], sortOrder: 11 },
  { title: 'AI Sales Assistant', priceFrom: 25000, categorySlug: 'ai-automations', rowGroup: 'popular', deliveryDays: 14, tags: ['ai', 'sales', 'assistant'], sortOrder: 12 },
  { title: 'AI Customer Support', priceFrom: 20000, categorySlug: 'ai-automations', rowGroup: 'popular', deliveryDays: 12, tags: ['ai', 'support', 'customer-service'], sortOrder: 13 },
  { title: 'AI Lead Qualification', priceFrom: 22000, categorySlug: 'ai-automations', rowGroup: 'popular', deliveryDays: 14, tags: ['ai', 'leads', 'qualification'], sortOrder: 14 },
  { title: 'AI Workflow System', priceFrom: 30000, categorySlug: 'ai-automations', rowGroup: 'popular', deliveryDays: 18, tags: ['ai', 'workflow', 'automation'], isFeatured: true, sortOrder: 15 },
  { title: 'AI Voice Assistant', priceFrom: 35000, categorySlug: 'ai-automations', rowGroup: 'popular', deliveryDays: 21, tags: ['ai', 'voice', 'assistant'], sortOrder: 16 },
];

function buildCategories(): MarketplaceCategory[] {
  return MAIN_MARKETPLACE_CATEGORIES.map((cat, i) => ({
    id: `mp-cat-${cat.slug}`,
    slug: cat.slug,
    name: cat.name,
    subtitle: cat.short,
    description: null,
    icon: MAIN_CATEGORY_EMOJI[cat.slug] ?? null,
    serviceCount: cat.serviceCount,
    sortOrder: i + 1,
    isFeatured: true,
  }));
}

function buildServices(categories: MarketplaceCategory[]): MarketplaceService[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  return SERVICE_SEEDS.map((seed, index) => {
    const category = bySlug.get(seed.categorySlug)!;
    const slug = slugify(seed.title);
    const sellerName = SELLERS[index % SELLERS.length];
    return {
      id: `mp-svc-${slug}`,
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name,
      slug,
      title: seed.title,
      shortDescription: `Professional ${seed.title.toLowerCase()} for Bangladeshi businesses.`,
      sellerId: null,
      sellerSlug: slugify(sellerName),
      sellerName,
      sellerLevel: index % 3 === 0 ? 'Top Rated Seller' : index % 3 === 1 ? 'Level 2 Seller' : 'Pro Seller',
      sellerAvatarUrl: null,
      sellerRating: 4.7 + (index % 3) * 0.1,
      sellerCity: 'Dhaka',
      thumbnailType: 'gradient' as const,
      thumbnailUrl: null,
      priceFrom: seed.priceFrom,
      currency: 'BDT',
      deliveryDays: seed.deliveryDays,
      rating: 4.7 + (index % 3) * 0.1,
      reviewCount: 32 + (index * 11) % 160,
      tags: seed.tags,
      rowGroup: seed.rowGroup,
      isPopular: seed.isPopular ?? false,
      isFeatured: seed.isFeatured ?? false,
      sortOrder: seed.sortOrder,
    };
  });
}

export function getMarketplaceFallbackData(): MarketplaceHomeData {
  const categories = buildCategories();
  const services = buildServices(categories);
  return { categories, services };
}
