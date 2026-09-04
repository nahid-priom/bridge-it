'use client';

import { useEffect, useState } from 'react';
import { scheduleDeferredThirdParty } from '@/lib/analytics/defer-third-party';
import {
  hasAnalyticsConsent,
  hasMarketingConsent,
  readCookieConsent,
  type CookieConsentPreferences,
} from '@/lib/analytics/cookie-consent';
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

function shouldLoadGtm(prefs: CookieConsentPreferences | null): boolean {
  return hasAnalyticsConsent(prefs) || hasMarketingConsent(prefs);
}

/**
 * Google Tag Manager — loads only after Analytics or Marketing consent,
 * then deferred until idle / first interaction.
 */
export function GoogleTagManager() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(shouldLoadGtm(readCookieConsent()));
    sync();
    const onConsent = () => sync();
    window.addEventListener('bitp-cookie-consent', onConsent as EventListener);
    window.addEventListener('storage', onConsent);
    return () => {
      window.removeEventListener('bitp-cookie-consent', onConsent as EventListener);
      window.removeEventListener('storage', onConsent);
    };
  }, []);

  useEffect(() => {
    if (!GTM_ID || !allowed) return;
    return scheduleDeferredThirdParty(() => injectGoogleTagManager(GTM_ID));
  }, [allowed]);

  if (!GTM_ID || !allowed) return null;

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
