'use client';

import { useEffect } from 'react';
import { scheduleDeferredThirdParty } from '@/lib/analytics/defer-third-party';
import { GTM_ID } from '@/lib/config/gtm';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function injectGoogleTagManager(containerId: string) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('gtm-script')) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
  const first = document.getElementsByTagName('script')[0];
  first?.parentNode?.insertBefore(script, first);
}

/**
 * Google Tag Manager — deferred until idle / first interaction.
 * Does not load during initial paint or hydration.
 */
export function GoogleTagManager() {
  useEffect(() => {
    if (!GTM_ID) return;
    return scheduleDeferredThirdParty(() => injectGoogleTagManager(GTM_ID));
  }, []);

  // noscript fallback only matters without JS — zero cost for normal users
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height={0}
        width={0}
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
