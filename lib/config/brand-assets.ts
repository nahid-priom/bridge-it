/**
 * Centralized Bridge IT Park brand asset paths.
 * All logo/favicon references should use these constants.
 */
export const BRAND_ASSETS = {
  logo: {
    source: '/brand/bridge-it-park-logo-source.png',
    full: '/brand/bridge-it-park-logo-full.png',
    transparent: '/brand/bridge-it-park-logo-transparent.png',
    transparentDark: '/brand/bridge-it-park-logo-transparent-dark.png',
    nav: '/brand/bridge-it-park-logo-nav.png',
    navDark: '/brand/bridge-it-park-logo-nav-dark.png',
    navSm: '/brand/bridge-it-park-logo-nav-sm.png',
    navSmDark: '/brand/bridge-it-park-logo-nav-sm-dark.png',
    footer: '/brand/bridge-it-park-logo-footer.png',
    footerDark: '/brand/bridge-it-park-logo-footer-dark.png',
    authDark: '/brand/bridge-it-park-logo-auth-dark.png',
    mark: '/brand/bridge-it-park-logo-mark.png',
  },
  icons: {
    markTransparent: '/icons/bridge-it-park-mark-transparent.png',
    markDark: '/icons/bridge-it-park-mark-dark.png',
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
