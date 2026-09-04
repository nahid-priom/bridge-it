'use client';

import { useEffect, useState } from 'react';
import { scheduleDeferredThirdParty } from '@/lib/analytics/defer-third-party';
import {
  hasAnalyticsConsent,
  readCookieConsent,
} from '@/lib/analytics/cookie-consent';
import { CLARITY_ID } from '@/lib/config/clarity';

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

function injectClarity(projectId: string) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ms-clarity')) return;

  (function (c: Window, l: Document, a: 'clarity', r: 'script', i: string) {
    c[a] =
      c[a] ||
      function (...args: unknown[]) {
        (c[a]!.q = c[a]!.q || []).push(args);
      };
    const t = l.createElement(r);
    t.id = 'ms-clarity';
    t.async = true;
    t.src = `https://www.clarity.ms/tag/${i}`;
    const y = l.getElementsByTagName(r)[0];
    y?.parentNode?.insertBefore(t, y);
  })(window, document, 'clarity', 'script', projectId);
}

/**
 * Microsoft Clarity — loads only after Analytics consent,
 * then deferred until idle / first interaction.
 */
export function MicrosoftClarity() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent(readCookieConsent()));
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
    if (!CLARITY_ID || !allowed) return;
    return scheduleDeferredThirdParty(() => injectClarity(CLARITY_ID));
  }, [allowed]);

  return null;
}
