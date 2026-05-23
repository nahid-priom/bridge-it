'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';

const PRIMARY_LOADER = {
  color: '#6C3CE1',
  shadow: '0 0 12px rgba(108, 60, 225, 0.45)',
} as const;

/** ~40% lighter than #5121C9 (mix toward white for dark backgrounds). */
const DARK_THEME_LOADER = {
  color: '#9779DF',
  shadow: '0 0 12px rgba(151, 121, 223, 0.5)',
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
