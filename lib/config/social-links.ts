/**
 * Official Bridge IT Park social / contact links.
 * Single source of truth — do not shorten, rename, or replace these URLs.
 */

export const OFFICIAL_WEBSITE = 'https://www.bridgeitpark.com';

export const WHATSAPP_CHANNEL = 'https://wa.me/bridgeitparkltd';

export const WHATSAPP_ORDER_CATALOG = 'https://wa.me/c/8801753223699';

export type SocialIconId =
  | 'facebook'
  | 'whatsapp'
  | 'instagram'
  | 'threads'
  | 'x'
  | 'linkedin'
  | 'youtube'
  | 'tiktok';

export type SocialLink = {
  name: string;
  url: string;
  icon: SocialIconId;
};

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/bridgeitparkltd',
    icon: 'facebook',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/bridgeitparkltd',
    icon: 'whatsapp',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/bridgeitpark',
    icon: 'instagram',
  },
  {
    name: 'Threads',
    url: 'https://threads.com/bridgeitpark',
    icon: 'threads',
  },
  {
    name: 'X',
    url: 'https://x.com/bridgeitpark',
    icon: 'x',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/bridgeitpark',
    icon: 'linkedin',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@BridgeITPark',
    icon: 'youtube',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/bridgeitparkltd',
    icon: 'tiktok',
  },
] as const;

export const WHATSAPP_CHAT_CTA = {
  label: 'Chat on WhatsApp',
  url: WHATSAPP_CHANNEL,
} as const;

export const WHATSAPP_ORDER_CTA = {
  label: 'Order Directly on WhatsApp',
  url: WHATSAPP_ORDER_CATALOG,
} as const;

/** Organization JSON-LD sameAs — website + social profiles */
export const SOCIAL_SAME_AS: readonly string[] = [
  OFFICIAL_WEBSITE,
  ...SOCIAL_LINKS.map((link) => link.url),
];
