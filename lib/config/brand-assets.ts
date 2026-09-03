/**
 * Centralized Bridge IT Park brand asset paths.
 * All logo/favicon references should use these constants.
 */
const LOGO_LIGHT = '/brand/bridge-it-park-logo-light.png';
const LOGO_DARK = '/brand/bridge-it-park-logo-dark.png';
const MARK_LIGHT = '/icons/bridge-it-park-mark-transparent.png';
const MARK_DARK = '/icons/bridge-it-park-mark-dark.png';

export const BRAND_ASSETS = {
  logo: {
    source: LOGO_LIGHT,
    sourceDark: LOGO_DARK,
    full: '/brand/bridge-it-park-logo-full.png',
    light: LOGO_LIGHT,
    dark: LOGO_DARK,
    transparent: LOGO_LIGHT,
    transparentDark: LOGO_DARK,
    nav: LOGO_LIGHT,
    navDark: LOGO_DARK,
    navSm: LOGO_LIGHT,
    navSmDark: LOGO_DARK,
    footer: LOGO_LIGHT,
    footerDark: LOGO_DARK,
    authDark: LOGO_DARK,
    mark: '/brand/bridge-it-park-logo-mark.png',
  },
  icons: {
    markTransparent: MARK_LIGHT,
    markDark: MARK_DARK,
    favicon16: '/icons/favicon-16x16.png',
    favicon32: '/icons/favicon-32x32.png',
    favicon48: '/icons/favicon-48x48.png',
    favicon180: '/icons/favicon-180x180.png',
    favicon192: '/icons/icon-192x192.png',
    favicon512: '/icons/icon-512x512.png',
    faviconIco: '/favicon.ico',
    faviconSvg: '/favicon.svg',
    appleTouch: '/apple-touch-icon.png',
  },
  og: {
    /** Generated at /opengraph-image */
    default: '/opengraph-image',
    twitter: '/twitter-image',
  },
} as const;

export const BRAND_COLORS = {
  navy: '#0f2744',
  navyDark: '#0b1f3a',
  blue: '#2563eb',
  emerald: '#10b981',
  emeraldBright: '#22c55e',
  white: '#ffffff',
  themeColor: '#0f2744',
  backgroundColor: '#0f2744',
} as const;
