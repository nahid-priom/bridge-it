import type { Viewport } from 'next';
import { BRAND_COLORS } from '@/lib/config/brand-assets';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.themeColor },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.themeColor },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
};
