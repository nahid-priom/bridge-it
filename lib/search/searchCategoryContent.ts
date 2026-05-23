import { formatQueryLabel } from '@/lib/search/searchHelpers';
import { MAIN_CATEGORY_BY_SLUG } from '@/constants/mainMarketplaceCategories';

export type SearchSubcategoryChip = {
  id: string;
  label: string;
  /** Search query applied when chip is selected */
  query: string;
};

const DEFAULT_CHIPS: SearchSubcategoryChip[] = [
  { id: 'website', label: 'Website Development', query: 'website development' },
  { id: 'ecommerce', label: 'Ecommerce', query: 'ecommerce website' },
  { id: 'wordpress', label: 'WordPress', query: 'wordpress' },
  { id: 'shopify', label: 'Shopify', query: 'shopify' },
  { id: 'react', label: 'React.js', query: 'react' },
  { id: 'nextjs', label: 'Next.js', query: 'next.js' },
  { id: 'laravel', label: 'Laravel', query: 'laravel' },
  { id: 'saas', label: 'SaaS', query: 'saas' },
  { id: 'uiux', label: 'UI/UX', query: 'ui ux design' },
  { id: 'seo', label: 'SEO', query: 'seo' },
];

const CHIPS_BY_CATEGORY: Record<string, SearchSubcategoryChip[]> = {
  'web-development': [
    { id: 'business-web', label: 'Business Websites', query: 'business website development' },
    { id: 'wordpress', label: 'WordPress', query: 'wordpress' },
    { id: 'ecommerce', label: 'Ecommerce', query: 'ecommerce website' },
    { id: 'shopify', label: 'Shopify', query: 'shopify' },
    { id: 'saas', label: 'SaaS', query: 'saas' },
    { id: 'react', label: 'React.js', query: 'react' },
    { id: 'nextjs', label: 'Next.js', query: 'next.js' },
    { id: 'laravel', label: 'Laravel', query: 'laravel' },
    { id: 'webflow', label: 'Webflow', query: 'webflow' },
    { id: 'wix', label: 'Wix', query: 'wix' },
    { id: 'uiux', label: 'UI/UX', query: 'ui ux design' },
    { id: 'seo', label: 'SEO', query: 'seo' },
  ],
  'software-development': [
    { id: 'saas', label: 'SaaS', query: 'saas development' },
    { id: 'erp', label: 'ERP Software', query: 'erp software' },
    { id: 'api', label: 'API Development', query: 'api development' },
    { id: 'custom', label: 'Custom Software', query: 'custom software' },
    { id: 'cloud', label: 'Cloud Solutions', query: 'cloud' },
  ],
  'app-development': [
    { id: 'android', label: 'Android', query: 'android app' },
    { id: 'ios', label: 'iOS', query: 'ios app' },
    { id: 'flutter', label: 'Flutter', query: 'flutter' },
    { id: 'react-native', label: 'React Native', query: 'react native' },
  ],
  'digital-marketing': [
    { id: 'facebook', label: 'Facebook Ads', query: 'facebook ads' },
    { id: 'google', label: 'Google Ads', query: 'google ads' },
    { id: 'seo', label: 'SEO', query: 'seo' },
    { id: 'social', label: 'Social Media', query: 'social media marketing' },
  ],
  'ai-automations': [
    { id: 'chatbot', label: 'AI Chatbot', query: 'ai chatbot' },
    { id: 'automation', label: 'Workflow Automation', query: 'automation' },
    { id: 'ml', label: 'Machine Learning', query: 'machine learning' },
  ],
};

const DESCRIPTION_BY_CATEGORY: Record<string, string> = {
  'web-development':
    'Find verified Bangladeshi freelancers and agencies for modern website development, ecommerce, SaaS, and custom business solutions.',
  'software-development':
    'Hire developers for custom software, ERP, APIs, and scalable SaaS products built for Bangladeshi businesses.',
  'app-development':
    'Connect with mobile experts for Android, iOS, and cross-platform apps — from MVPs to production releases.',
  'digital-marketing':
    'Grow your brand with SEO, paid ads, and social campaigns from experienced Bangladeshi marketers.',
  'ai-automations':
    'Build AI chatbots, automations, and intelligent workflows with trusted local AI specialists.',
};

const DEFAULT_DESCRIPTION =
  'Browse verified freelancers and agencies across Bangladesh. Refine by category, budget, and delivery time.';

const PLACEHOLDER_BY_CATEGORY: Record<string, string> = {
  'web-development': 'Search website developers...',
  'software-development': 'Search software developers...',
  'app-development': 'Search app developers...',
  'digital-marketing': 'Search marketing experts...',
  'ai-automations': 'Search AI specialists...',
};

export function getSearchSubcategoryChips(categorySlug: string): SearchSubcategoryChip[] {
  if (categorySlug && CHIPS_BY_CATEGORY[categorySlug]) {
    return CHIPS_BY_CATEGORY[categorySlug];
  }
  return DEFAULT_CHIPS;
}

export function getSearchCategoryTitle(categorySlug: string, query: string): string {
  const trimmed = query.trim();
  if (trimmed) {
    const label = formatQueryLabel(trimmed);
    if (/\bservices?\b/i.test(label)) return label;
    return `${label} Services`;
  }
  const cat = categorySlug ? MAIN_CATEGORY_BY_SLUG[categorySlug] : undefined;
  if (cat) {
    if (categorySlug === 'web-development') return 'Website Development Services';
    return cat.name;
  }
  return 'Browse Marketplace Services';
}

export function getSearchCategoryDescription(categorySlug: string): string {
  if (categorySlug && DESCRIPTION_BY_CATEGORY[categorySlug]) {
    return DESCRIPTION_BY_CATEGORY[categorySlug];
  }
  return DEFAULT_DESCRIPTION;
}

export function getSearchPlaceholder(categorySlug: string): string {
  if (categorySlug && PLACEHOLDER_BY_CATEGORY[categorySlug]) {
    return PLACEHOLDER_BY_CATEGORY[categorySlug];
  }
  return 'Search services, skills, or sellers...';
}

export function matchActiveChip(
  chips: SearchSubcategoryChip[],
  query: string
): string | null {
  const norm = query.trim().toLowerCase();
  if (!norm) return null;
  const exact = chips.find((c) => c.query.toLowerCase() === norm);
  if (exact) return exact.id;
  const partial = chips.find(
    (c) => norm.includes(c.query.toLowerCase()) || c.query.toLowerCase().includes(norm)
  );
  return partial?.id ?? null;
}
