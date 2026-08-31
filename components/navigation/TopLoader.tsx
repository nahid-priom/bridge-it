'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { BRAND_COLORS } from '@/lib/config/brand-assets';

const PRIMARY_LOADER = {
  color: BRAND_COLORS.emerald,
  shadow: '0 0 12px rgba(16, 185, 129, 0.45)',
} as const;

const DARK_THEME_LOADER = {
  color: '#34d399',
  shadow: '0 0 12px rgba(52, 211, 153, 0.5)',
} as const;

/** Route progress bar — primary in light theme, softened purple in dark. */
export function TopLoader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const { color, shadow } = isDark ? DARK_THEME_LOADER : PRIMARY_LOADER;

  return (
    <NextTopLoader
      key={isDark ? 'dark' : 'light'}
      color={color}
      height={5}
      showSpinner={false}
      crawl
      crawlSpeed={180}
      speed={280}
      easing="ease"
      shadow={shadow}
      zIndex={9999}
      showAtBottom={false}
    />
  );
}
