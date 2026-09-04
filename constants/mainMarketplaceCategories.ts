import type { LucideIcon } from 'lucide-react';
import { Blocks, Bot, Globe, Megaphone, Smartphone } from 'lucide-react';

export type MainCategoryIcon = 'Blocks' | 'Globe' | 'Smartphone' | 'Megaphone' | 'Bot';

export type MainMarketplaceCategory = {
  slug: string;
  name: string;
  short: string;
  icon: MainCategoryIcon;
  serviceCount: number;
};

export const MAIN_MARKETPLACE_CATEGORIES: MainMarketplaceCategory[] = [
  {
    slug: 'software-development',
    name: 'Software Development',
    short: 'Custom software & SaaS',
    icon: 'Blocks',
    serviceCount: 160,
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    short: 'Websites & landing pages',
    icon: 'Globe',
    serviceCount: 260,
  },
  {
    slug: 'app-development',
    name: 'App Development',
    short: 'iOS, Android & cross-platform',
    icon: 'Smartphone',
    serviceCount: 140,
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    short: 'SEO, ads & social media',
    icon: 'Megaphone',
    serviceCount: 320,
  },
  {
    slug: 'ai-automations',
    name: 'AI & Automations',
    short: 'Chatbots & workflows',
    icon: 'Bot',
    serviceCount: 90,
  },
];

export const MAIN_CATEGORY_SLUGS = MAIN_MARKETPLACE_CATEGORIES.map((c) => c.slug);

export const MAIN_CATEGORY_BY_SLUG = Object.fromEntries(
  MAIN_MARKETPLACE_CATEGORIES.map((c) => [c.slug, c])
) as Record<string, MainMarketplaceCategory>;

const LUCIDE_MAP: Record<MainCategoryIcon, LucideIcon> = {
  Blocks,
  Globe,
  Smartphone,
  Megaphone,
  Bot,
};

export function getMainCategoryIcon(icon: MainCategoryIcon): LucideIcon {
  return LUCIDE_MAP[icon];
}

export function isMainCategorySlug(slug: string): boolean {
  return slug in MAIN_CATEGORY_BY_SLUG;
}

/** Emoji fallback for legacy cards that expect a string icon */
export const MAIN_CATEGORY_EMOJI: Record<string, string> = {
  'software-development': '💻',
  'web-development': '🌐',
  'app-development': '📱',
  'digital-marketing': '📣',
  'ai-automations': '🤖',
};

export const SEARCH_POPULAR_CHIPS = [
  'Fashion Store Website',
  'Garments ERP System',
  'Retail POS Software',
  'Beauty Shop Design',
  'Social Media Design',
  'Facebook Ads Setup',
] as const;
